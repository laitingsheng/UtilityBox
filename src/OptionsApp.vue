<script setup lang="ts">
import BookmarkBaseAttributesComponent from "./components/BookmarkBaseAttributesComponent.vue";
import BookmarkFolderAttributesComponent from "./components/BookmarkFolderAttributesComponent.vue";
import BookmarkFolderComponent from "./components/BookmarkFolderComponent.vue";
import BookmarkItemAttributesComponent from "./components/BookmarkItemAttributesComponent.vue";
import CleaningRuleComponent from "./components/CleaningRuleComponent.vue";
import { use_bookmarks_store, type Bookmark } from "./stores/bookmarks";
import { use_cleaning_store, type CleaningRuleProperties } from "./stores/cleaning";
import { use_preferences_store } from "./stores/preferences";

const bookmarks_store = use_bookmarks_store();
const cleaning_store = use_cleaning_store();
const preferences_store = use_preferences_store();

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
		return;
	}
	console.error(`chrome.bookmarks.onRemoved: Bookmark #${id} is not found in parent #${info.parentId} at index ${info.index}.`);
});

chrome.storage.sync.get<{
	folderonly: boolean;
	cleaningrules: Record<string, CleaningRuleProperties>;
	cleaningruledefault: CleaningRuleProperties;
}>({
	folderonly: true,
	cleaningrules: {},
	cleaningruledefault: {
		subdomains: true,
		bookmarks: false,
		history: true,
	},
}).then(({ folderonly, cleaningrules, cleaningruledefault }) => {
	preferences_store.folderonly = folderonly;
	cleaning_store.rules = cleaningrules;
	cleaning_store.ruledefault = cleaningruledefault;
}, (reason) => {
	console.error(`chrome.storage.sync.get: ${reason}`);
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
			<div class="card-actions justify-end">
				<template v-if="bookmarks_store.selected.folder">
					<button type="button" class="btn btn-primary" :disabled="bookmarks_store.grouping">Run Rules</button>
					<button type="button" class="btn btn-primary">Save Rules</button>
				</template>
				<button type="submit" class="btn">Close</button>
			</div>
		</form>
		<form method="dialog" class="modal-backdrop">
			<button type="submit"></button>
		</form>
	</dialog>
</template>
