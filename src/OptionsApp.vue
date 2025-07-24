<script setup lang="ts">
import BookmarkBaseAttributesComponent from "./components/BookmarkBaseAttributesComponent.vue";
import BookmarkFolderAttributesComponent from "./components/BookmarkFolderAttributesComponent.vue";
import BookmarkFolderComponent from "./components/BookmarkFolderComponent.vue";
import BookmarkItemAttributesComponent from "./components/BookmarkItemAttributesComponent.vue";
import CleaningRuleComponent from "./components/CleaningRuleComponent.vue";
import GroupingRuleComponent from "./components/GroupingRuleComponent.vue";
import RewriteRuleComponent from "./components/RewriteRuleComponent.vue";
import { use_bookmarks_store, type Bookmark } from "./stores/bookmarks";
import { use_cleaning_store, type CleaningRuleProperties } from "./stores/cleaning";
import { use_grouping_store, type GroupingRuleProperties } from "./stores/grouping";
import { use_preferences_store } from "./stores/preferences";
import { use_rewrite_store } from "./stores/rewrite";

const bookmarks_store = use_bookmarks_store();
const cleaning_store = use_cleaning_store();
const grouping_store = use_grouping_store();
const preferences_store = use_preferences_store();
const rewrite_store = use_rewrite_store();

chrome.storage.sync.get<{
	folderonly: boolean;
	groupingrules: Record<string, Record<string, GroupingRuleProperties>>;
	cleaningrules: Record<string, CleaningRuleProperties>;
	cleaningruledefault: CleaningRuleProperties;
	rewriterules: Record<string, string>;
}>({
	folderonly: true,
	groupingrules: {},
	cleaningrules: {},
	cleaningruledefault: {
		subdomains: true,
		bookmarks: false,
		history: true,
	},
	rewriterules: {},
}).then(({ folderonly, groupingrules, cleaningrules, cleaningruledefault, rewriterules }) => {
	preferences_store.folderonly = folderonly;
	grouping_store.rules = groupingrules;
	cleaning_store.rules = cleaningrules;
	cleaning_store.ruledefault = cleaningruledefault;
	rewrite_store.rules = rewriterules;
}, (reason) => {
	console.error(`chrome.storage.sync.get: ${reason}`);
});

chrome.bookmarks.getTree().then((nodes) => {
	if (nodes.length !== 1) {
		throw new RangeError("Bookmark root node is not a single node.");
	}
	const root = nodes[0];
	if (root.children?.length !== 2) {
		throw new RangeError("Bookmark root node should have exactly two top-level nodes.");
	}
	const parent = bookmarks_store.traverse(root.children[0]);
	if (parent.folder !== true) {
		throw new TypeError("Parent node is not a folder.");
	}
	bookmarks_store.parent = parent;
	const others = bookmarks_store.traverse(root.children[1]);
	if (others.folder !== true) {
		throw new TypeError("Others node is not a folder.");
	}
	bookmarks_store.others = others;
}).catch((reason) => {
	console.error(`chrome.bookmarks.getTree: ${reason}`);
});

chrome.bookmarks.onChanged.addListener((id, info) => {
	const bookmark = bookmarks_store.bookmarks[id];
	if (bookmark === undefined) {
		console.error(`chrome.bookmarks.onChanged: Detected bookmark change for unknown id ${id}.`);
		return;
	}
	bookmark.title = info.title;
	if (info.url !== undefined) {
		if (bookmark.folder) {
			console.error(`chrome.bookmarks.onChanged: URL is assigned to folder #${id}.`);
			return;
		}
		bookmark.url = info.url;
	}
});

chrome.bookmarks.onChildrenReordered.addListener((id, info) => {
	const bookmark = bookmarks_store.bookmarks[id];
	if (bookmark === undefined) {
		console.error(`chrome.bookmarks.onChildrenReordered: Detected children reordering for unknown id ${id}.`);
		return;
	}
	if (!bookmark.folder) {
		console.error(`chrome.bookmarks.onChildrenReordered: Bookmark #${id} is not a folder.`);
		return;
	}
	const children = new Array<Bookmark>();
	for (const cid of info.childIds) {
		const child = bookmarks_store.bookmarks[cid];
		if (child === undefined) {
			console.error(`chrome.bookmarks.onChildrenReordered: Bookmark #${id} has an unknown child id ${cid}.`);
			continue;
		}
		children.push(child);
	}
	bookmark.children = children;
});

chrome.bookmarks.onCreated.addListener((id, node) => {
	if (node.parentId === undefined) {
		console.error(`chrome.bookmarks.onCreated: Unexpected bookmark #${id} has no valid parent.`);
		return;
	}
	const parent = bookmarks_store.bookmarks[node.parentId];
	if (parent === undefined) {
		console.error(`chrome.bookmarks.onCreated: Parent #${node.parentId} of bookmark #${id} is not found.`);
		return;
	}
	if (!parent.folder) {
		console.error(`chrome.bookmarks.onCreated: Parent #${node.parentId} of bookmark #${id} is not a folder.`);
		return;
	}
	parent.children.push(bookmarks_store.traverse(node));
});

chrome.bookmarks.onMoved.addListener((id, info) => {
	const source = bookmarks_store.bookmarks[info.oldParentId];
	if (source === undefined) {
		console.error(`chrome.bookmarks.onMoved: Detected move of bookmark #${id} from unknown folder #${info.oldParentId}.`);
		return;
	}
	if (!source.folder) {
		console.error(`chrome.bookmarks.onMoved: Source #${info.oldParentId} of moved bookmark #${id} is not a folder.`);
		return;
	}
	const target = bookmarks_store.bookmarks[info.parentId];
	if (target === undefined) {
		console.error(`chrome.bookmarks.onMoved: Detected move of bookmark #${id} to unknown folder #${info.parentId}.`);
		return;
	}
	if (!target.folder) {
		console.error(`chrome.bookmarks.onMoved: Target #${info.parentId} of moved bookmark #${id} is not a folder.`);
		return;
	}
	if (info.oldIndex < source.children.length && source.children[info.oldIndex]?.id === id && info.index <= target.children.length) {
		const bookmark = bookmarks_store.bookmarks[id];
		if (bookmark === undefined) {
			console.error(`chrome.bookmarks.onMoved: Detected move of unknown bookmark #${id}.`);
			return;
		}
		source.children.splice(info.oldIndex, 1);
		target.children.splice(info.index, 0, bookmark);
	}
});

chrome.bookmarks.onRemoved.addListener((id, info) => {
	const parent = bookmarks_store.bookmarks[info.parentId];
	if (parent === undefined) {
		console.error(`chrome.bookmarks.onRemoved: Parent #${info.parentId} of removed bookmark #${id} is not found.`);
		return;
	}
	if (!parent.folder) {
		console.error(`chrome.bookmarks.onRemoved: Parent #${info.parentId} of removed bookmark #${id} is not a folder.`);
		return;
	}
	if (info.index < parent.children.length && parent.children[info.index]?.id === id) {
		parent.children.splice(info.index, 1);
		if (bookmarks_store.selected?.id === id) {
			bookmarks_store.selected = undefined;
		}
		delete bookmarks_store.bookmarks[id];
		delete grouping_store.rules[id];
		return;
	}
	console.error(`chrome.bookmarks.onRemoved: Bookmark #${id} is not found in parent #${info.parentId} at index ${info.index}.`);
});

async function switch_folderonly(event: Event) {
	const checkbox = event.target as HTMLInputElement;
	preferences_store.folderonly = checkbox.checked;
	await chrome.storage.sync.set({
		folderonly: checkbox.checked,
	}).catch((reason) => {
		console.error(`chrome.storage.sync.set: ${reason}`);
	});
}

async function group_bookmarks_into(id: string) {
	grouping_store.running = true;
	const rules = grouping_store.rules[id];
	if (rules === undefined) {
		console.error(`Grouping rules for folder #${id} are not defined.`);
		grouping_store.running = false;
		return;
	}
	for (const hostname in rules) {
		const properties = rules[hostname];
		if (properties === undefined) {
			console.error(`Grouping rule for ${hostname} is undefined.`);
			continue;
		}
		const pattern = new URLPattern({
			hostname: properties.subdomains ? `(.+\\.)?${hostname}` : hostname,
		});
		for (const result of await chrome.bookmarks.search({
			query: hostname,
		})) {
			if (result.parentId === id) {
				continue;
			}
			if (result.url !== undefined && pattern.test(result.url)) {
				console.info(`Moving bookmark #${result.id} (${result.url}) to folder #${id}...`);
				await chrome.bookmarks.move(result.id, { parentId: id });
			}
		}
	}
	grouping_store.running = false;
}

async function rewrite_bookmarks_urls() {
	rewrite_store.running = true;
	const compiled = new Array<[RegExp, string]>();
	for (const pattern in rewrite_store.rules) {
		const replace = rewrite_store.rules[pattern];
		if (replace === undefined || replace.length === 0) {
			continue;
		}
		compiled.push([new RegExp(`^${pattern}$`, "v"), replace]);
	}
	for (const id in bookmarks_store.bookmarks) {
		const bookmark = bookmarks_store.bookmarks[id];
		if (bookmark?.folder !== false) {
			continue;
		}
		for (const [pattern, replace] of compiled) {
			const url = bookmark.url.replace(pattern, replace);
			if (url !== bookmark.url) {
				console.info(`Rewriting bookmark #${id} URL from ${bookmark.url} to ${url}...`);
				await chrome.bookmarks.update(id, { url });
				break;
			}
		}
	}
	rewrite_store.running = false;
}

async function clean_bookmarks() {
	cleaning_store.bookmarks = true;
	for (const hostname in cleaning_store.rules) {
		const properties = cleaning_store.rules[hostname];
		if (properties === undefined) {
			console.error(`Cleaning rule for ${hostname} is undefined.`);
			continue;
		}
		if (!properties.bookmarks) {
			continue;
		}
		const pattern = new URLPattern({
			hostname: properties.subdomains ? `(.+\\.)?${hostname}` : hostname,
		});
		for (const result of await chrome.bookmarks.search({
			query: hostname,
		})) {
			if (result.url !== undefined && pattern.test(result.url)) {
				console.info(`Deleting bookmark #${result.id}: ${result.url}...`);
				await chrome.bookmarks.remove(result.id);
			}
		}
	}
	cleaning_store.bookmarks = false;
}

async function clean_history() {
	cleaning_store.history = true;
	for (const hostname in cleaning_store.rules) {
		const properties = cleaning_store.rules[hostname];
		if (properties === undefined) {
			console.error(`Cleaning rule for ${hostname} is undefined.`);
			continue;
		}
		if (!properties.history) {
			continue;
		}
		const pattern = new URLPattern({
			hostname: properties.subdomains ? `(.+\\.)?${hostname}` : hostname,
		});
		for (const result of await chrome.history.search({
			text: hostname,
			maxResults: 1e9,
			startTime: 0,
		})) {
			if (result.url !== undefined && pattern.test(result.url)) {
				console.info(`Deleting history entry #${result.id}: ${result.url}...`);
				await chrome.history.deleteUrl({ url: result.url });
			}
		}
	}
	cleaning_store.history = false;
}

async function save_grouping_rules() {
	await chrome.storage.sync.set({
		groupingruledefault: grouping_store.ruledefault,
		groupingrules: grouping_store.rules,
	}).catch((reason) => {
		console.error(`chrome.storage.sync.set: ${reason}`);
	});
	grouping_store.updated = false;
}

async function save_rewrite_rules() {
	await chrome.storage.sync.set({
		rewriterules: rewrite_store.rules,
	}).catch((reason) => {
		console.error(`chrome.storage.sync.set: ${reason}`);
	});
	rewrite_store.updated = false;
}

async function save_cleaning_rules() {
	await chrome.storage.sync.set({
		cleaningruledefault: cleaning_store.ruledefault,
		cleaningrules: cleaning_store.rules,
	}).catch((reason) => {
		console.error(`chrome.storage.sync.set: ${reason}`);
	});
	cleaning_store.updated = false;
}
</script>

<template>
	<header class="bg-base-100 navbar shadow-sm">
		<div class="navbar-start">
			<a class="btn btn-ghost text-xl">Bookmark Manager</a>
		</div>
		<div class="navbar-end">
			<label class="label mx-2">
				<input type="checkbox" :checked="preferences_store.folderonly" class="toggle toggle-primary" @click="switch_folderonly" />
				Folder Only
			</label>
		</div>
	</header>
	<main class="bg-base-100 block px-8">
		<div class="card bg-base-200">
			<div class="card-body">
				<h2 class="card-title">Bookmarks</h2>
				<ul class="menu w-full">
					<li v-if="bookmarks_store.parent === undefined" class="skeleton w-full h-4"></li>
					<BookmarkFolderComponent v-else v-bind="bookmarks_store.parent" />
					<li v-if="bookmarks_store.others === undefined" class="skeleton w-full h-4"></li>
					<BookmarkFolderComponent v-else v-bind="bookmarks_store.others" />
				</ul>
				<div class="card-actions justify-end">
					<button type="button" class="btn btn-primary" :disabled="!grouping_store.updated" @click="save_grouping_rules">Save</button>
				</div>
			</div>
		</div>
		<div class="card bg-base-200 my-4">
			<div class="card-body">
				<h2 class="card-title">
					Bookmarks URL Rewrite Rules
					<span class="badge badge-warning">Advanced</span>
					<span class="badge badge-warning">Use with cautions</span>
				</h2>
				<ul class="list">
					<RewriteRuleComponent />
					<RewriteRuleComponent v-for="(replace, pattern, index) in rewrite_store.rules" :key="index" :pattern :replace />
				</ul>
				<div class="card-actions justify-end">
					<button type="button" class="btn btn-primary" :disabled="rewrite_store.running" @click="rewrite_bookmarks_urls">Run</button>
					<button type="button" class="btn btn-primary" :disabled="!rewrite_store.updated" @click="save_rewrite_rules">Save</button>
				</div>
			</div>
		</div>
		<div class="card bg-base-200">
			<div class="card-body">
				<h2 class="card-title">Cleaning Rules</h2>
				<ul class="list">
					<CleaningRuleComponent v-bind="cleaning_store.ruledefault" />
					<CleaningRuleComponent v-for="(properties, hostname, index) in cleaning_store.rules" :key="index" :hostname v-bind="properties" />
				</ul>
				<div class="card-actions justify-end">
					<button type="button" class="btn btn-primary" :disabled="cleaning_store.bookmarks" @click="clean_bookmarks">Clean Bookmarks</button>
					<button type="button" class="btn btn-primary" :disabled="cleaning_store.history" @click="clean_history">Clean History</button>
					<button type="button" class="btn btn-primary" :disabled="!cleaning_store.updated" @click="save_cleaning_rules">Save</button>
				</div>
			</div>
		</div>
	</main>
	<dialog v-if="bookmarks_store.selected !== undefined" class="modal" open @close="bookmarks_store.selected = undefined">
		<form method="dialog" class="modal-box card-body max-w-full">
			<h2 class="card-title">Attributes</h2>
			<BookmarkBaseAttributesComponent v-bind="bookmarks_store.selected" />
			<component :is="bookmarks_store.selected.folder ? BookmarkFolderAttributesComponent : BookmarkItemAttributesComponent" v-bind="bookmarks_store.selected" />
			<template v-if="bookmarks_store.selected.folder">
				<div class="divider">Grouping Rules</div>
				<ul class="list">
					<GroupingRuleComponent :id="bookmarks_store.selected.id" v-bind="grouping_store.ruledefault" />
					<GroupingRuleComponent v-for="(properties, hostname, index) in grouping_store.rules[bookmarks_store.selected.id]" :key="index" :id="bookmarks_store.selected.id" :hostname v-bind="properties" />
				</ul>
			</template>
			<div class="card-actions justify-end">
				<template v-if="bookmarks_store.selected.folder">
					<button type="button" class="btn btn-primary" :disabled="grouping_store.running" @click="group_bookmarks_into(bookmarks_store.selected.id)">Run Rules</button>
				</template>
				<button type="submit" class="btn">Close</button>
			</div>
		</form>
		<form method="dialog" class="modal-backdrop">
			<button type="submit"></button>
		</form>
	</dialog>
</template>
