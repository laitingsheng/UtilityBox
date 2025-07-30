<script setup lang="ts">
import icons from "@/assets/icons";
import BookmarkDetails from "@/components/BookmarkDetails.vue";
import BookmarkTreeRow from "@/components/BookmarkTreeRow.vue";
import CleaningRules from "@/components/CleaningRules.vue";
import RewriteRules from "@/components/RewriteRules.vue";
import { enableediting, folderonly } from "@/states/preferences";
import { use_bookmarks_store } from "@/stores/bookmarks";

const bookmarks_store = use_bookmarks_store();

async function sync_toggle(event: Event): Promise<void> {
	const target = event.target as HTMLInputElement;
	return await chrome.storage.sync.set({
		[target.name]: target.checked,
	}).catch((reason) => {
		console.error(`chrome.storage.sync.set: ${reason}`);
	});
}

chrome.bookmarks.getTree().then((nodes) => {
	if (nodes.length !== 1) {
		throw new RangeError("Bookmark root node is not a single node.");
	}
	const root = nodes[0];
	if (root.children?.length !== 2) {
		throw new RangeError("Bookmark root node should have exactly two top-level nodes.");
	}
	const parent = root.children[0];
	bookmarks_store.parent = parent.id;
	bookmarks_store.traverse(parent);
	const others = root.children[1];
	bookmarks_store.others = others.id;
	bookmarks_store.traverse(others);
}).catch((reason) => {
	console.error(`chrome.bookmarks.getTree: ${reason}`);
});

chrome.bookmarks.onChanged.addListener((id, info) => {
	const bookmark = bookmarks_store.bookmarks[id];
	if (bookmark === undefined) {
		console.error(`chrome.bookmarks.onChanged: Detected bookmark change for unknown bookmark #${id}.`);
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
		console.error(`chrome.bookmarks.onChildrenReordered: Detected children reordering for unknown bookmark #${id}.`);
		return;
	}
	if (!bookmark.folder) {
		console.error(`chrome.bookmarks.onChildrenReordered: Bookmark #${id} is not a folder.`);
		return;
	}
	for (const childId of bookmark.children) {
		if (bookmarks_store.bookmarks[childId] === undefined) {
			console.error(`chrome.bookmarks.onChildrenReordered: Child #${childId} of bookmark #${id} is not found.`);
		}
	}
	bookmark.children = info.childIds;
});

chrome.bookmarks.onCreated.addListener((id, node) => {
	const bookmark = bookmarks_store.bookmarks[id];
	if (bookmark !== undefined) {
		console.error(`chrome.bookmarks.onCreated: Detected creation of already existing bookmark #${id}.`);
		return;
	}
	if (node.parentId === undefined) {
		console.error(`chrome.bookmarks.onCreated: Unexpected orphaned bookmark #${id}.`);
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
	bookmarks_store.traverse(node);
	parent.children.push(id);
});

chrome.bookmarks.onMoved.addListener((id, info) => {
	const bookmark = bookmarks_store.bookmarks[id];
	if (bookmark === undefined) {
		console.error(`chrome.bookmarks.onMoved: Detected move of unknown bookmark #${id}.`);
		return;
	}
	const source = bookmarks_store.bookmarks[info.oldParentId];
	if (source?.folder !== true) {
		console.error(`chrome.bookmarks.onMoved: Source #${info.oldParentId} of moved bookmark #${id} is not a folder.`);
		return;
	}
	const target = bookmarks_store.bookmarks[info.parentId];
	if (target?.folder !== true) {
		console.error(`chrome.bookmarks.onMoved: Target #${info.parentId} of moved bookmark #${id} is not a folder.`);
		return;
	}
	if (source.children[info.oldIndex] !== id) {
		console.error(`chrome.bookmarks.onMoved: Bookmark #${id} is not found in source #${info.oldParentId} at index ${info.oldIndex}.`);
		return;
	}
	source.children.splice(info.oldIndex, 1);
	target.children.splice(info.index, 0, id);
});

chrome.bookmarks.onRemoved.addListener((id, info) => {
	const parent = bookmarks_store.bookmarks[info.parentId];
	if (parent?.folder !== true) {
		console.error(`chrome.bookmarks.onRemoved: Parent #${info.parentId} of removed bookmark #${id} is not a folder.`);
		return;
	}
	if (parent.children[info.index] !== id) {
		console.error(`chrome.bookmarks.onRemoved: Bookmark #${id} is not found in parent #${info.parentId} at index ${info.index}.`);
		return;
	}
	parent.children.splice(info.index, 1);
});

chrome.storage.sync.remove([
	"groupingruledefault",
	"groupingrules",
]);
</script>

<template>
	<header class="bg-base-100 navbar shadow-sm">
		<div class="navbar-start">
			<a class="btn btn-ghost text-xl">Bookmark Manager</a>
		</div>
		<div class="navbar-end">
			<label class="label mx-2">
				<input type="checkbox" name="enableediting" class="toggle toggle-primary" v-model="enableediting" @click="sync_toggle" />
				Enable Editing
			</label>
			<label class="label mx-2">
				<input type="checkbox" name="folderonly" class="toggle toggle-primary" v-model="folderonly" @click="sync_toggle" />
				Folder Only
			</label>
		</div>
	</header>
	<main class="bg-base-100 block px-8 space-y-4">
		<div class="card bg-base-200">
			<div class="card-body">
				<h2 class="card-title"><span class="text-center w-4">{{ icons.BOOKMARK_GROUP }}</span> Bookmarks</h2>
				<ul class="menu w-full">
					<BookmarkTreeRow v-if="bookmarks_store.parent" :id="bookmarks_store.parent" :folderonly />
					<BookmarkTreeRow v-if="bookmarks_store.others" :id="bookmarks_store.others" :folderonly />
				</ul>
			</div>
		</div>
		<RewriteRules />
		<CleaningRules />
	</main>
	<BookmarkDetails />
</template>
