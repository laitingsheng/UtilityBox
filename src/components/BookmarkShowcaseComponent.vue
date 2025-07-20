<script setup lang="ts">
import { use_bookmarks_store, type Bookmark } from "../stores/bookmarks";
import BookmarkFolderComponent from "./BookmarkFolderComponent.vue";

const bookmarks_store = use_bookmarks_store();

await chrome.bookmarks.getTree().then((nodes) => {
	if (nodes.length !== 1) {
		throw {
			message: "Bookmark root node is not a single node.",
		} as chrome.runtime.LastError;
	}
	const root = nodes[0];
	if (root.children?.length !== 2) {
		throw {
			message: "Bookmark root node should have exactly two top-level nodes.",
		} as chrome.runtime.LastError;
	}
	const parent = bookmarks_store.traverse(root.children[0]);
	if (parent.folder !== true) {
		throw {
			message: "Parent node is not a folder.",
		} as chrome.runtime.LastError;
	}
	bookmarks_store.parent = parent;
	const others = bookmarks_store.traverse(root.children[1]);
	if (others.folder !== true) {
		throw {
			message: "Others node is not a folder.",
		} as chrome.runtime.LastError;
	}
	bookmarks_store.others = others;
}).catch((reason) => {
	console.error(`chrome.bookmarks.getTree: ${reason}`);
});

chrome.bookmarks.onChanged.addListener((id, info) => {
	const bookmark = bookmarks_store.bookmarks[id];
	if (bookmark === undefined) {
		console.error(`Detected bookmark change for unknown id ${id}.`);
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
		if (bookmarks_store.selected_id === id) {
			bookmarks_store.selected_id = undefined;
		}
		delete bookmarks_store.bookmarks[id];
		return;
	}
	console.error(`chrome.bookmarks.onRemoved: Bookmark #${id} is not found in parent #${info.parentId} at index ${info.index}.`);
});
</script>

<template>
	<BookmarkFolderComponent v-if="bookmarks_store.parent !== undefined" v-bind="bookmarks_store.parent" />
	<BookmarkFolderComponent v-if="bookmarks_store.others !== undefined" v-bind="bookmarks_store.others" />
</template>
