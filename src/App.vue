<script setup lang="ts">
import { faCircleExclamation, faCircleInfo, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import BookmarkTree from "./components/BookmarkTree.vue";
import { use_bookmarks_store, type Bookmark } from "./stores/bookmarks";
import { use_logging_store } from "./stores/logging";
import { use_preferences_store } from "./stores/preferences";

const bookmarks_store = use_bookmarks_store();
const logging_store = use_logging_store();
const preferences_store = use_preferences_store();

chrome.storage.sync.get<Record<string, boolean>>({
	folderonly: true,
}, ({ folderonly }) => {
	if (logging_store.error_chrome("chrome.storage.sync.get")) {
		return;
	}
	preferences_store.folderonly = folderonly;
});

function switch_folderonly() {
	preferences_store.folderonly = !preferences_store.folderonly;

	chrome.storage.sync.set({
		folderonly: preferences_store.folderonly,
	}, () => {
		logging_store.error_chrome("chrome.storage.sync.set");
	});
}

function traverse(node: chrome.bookmarks.BookmarkTreeNode, parent_id: string, index: number): Bookmark | undefined {
	if (bookmarks_store.bookmarks[node.id] !== undefined) {
		logging_store.error(`chrome.bookmarks.getTree: Bookmark #${node.id} already exists in store.`);
		bookmarks_store.invalid.add(node.id);
		return undefined;
	}
	if (node.parentId !== parent_id) {
		logging_store.error(`chrome.bookmarks.getTree: Bookmark #${node.id} has no parent id.`);
		bookmarks_store.invalid.add(node.id);
		return undefined;
	}
	if (node.index !== index) {
		logging_store.error(`chrome.bookmarks.getTree: Bookmark #${node.id} has unmatched index.`);
		bookmarks_store.invalid.add(node.id);
		return undefined;
	}

	if (
		node.url === undefined &&
		node.children !== undefined &&
		node.dateLastUsed === undefined
	) {
		const bookmark: Bookmark = {
			immutable: node.unmodifiable !== undefined,
			id: node.id,
			title: node.title,
			parent_id,
			added: new Date(node.dateAdded ?? 0),
			folder: true,
			children: node.children.map((child, index) => traverse(child, node.id, index)),
			last_modified: new Date(node.dateGroupModified ?? 0),
		};
		bookmarks_store.bookmarks[node.id] = bookmark;
		return bookmark;
	}
	if (
		node.url !== undefined &&
		node.children === undefined &&
		node.folderType === undefined &&
		node.dateGroupModified === undefined
	) {
		const url = URL.parse(node.url);
		if (url === null) {
			logging_store.error(`chrome.bookmarks.getTree: Bookmark #${node.id} has an invalid URL.`);
			bookmarks_store.invalid.add(node.id);
			return undefined;
		}
		const bookmark: Bookmark = {
			immutable: node.unmodifiable !== undefined,
			id: node.id,
			title: node.title,
			parent_id,
			added: new Date(node.dateAdded ?? 0),
			folder: false,
			url,
			last_used: new Date(node.dateLastUsed ?? 0),
		};
		bookmarks_store.bookmarks[node.id] = bookmark;
		return bookmark;
	}
	bookmarks_store.invalid.add(node.id);
	logging_store.error(`chrome.bookmarks.getTree: Bookmark node #${node.id} is neither a folder nor a bookmark.`);
	return undefined;
}

chrome.bookmarks.getTree((nodes) => {
	if (nodes.length !== 1) {
		logging_store.error("chrome.bookmarks.getTree: Bookmark root node is not a single node.");
		return;
	}
	const root = nodes[0];
	if (root.children?.length !== 2) {
		logging_store.error("chrome.bookmarks.getTree: Bookmark should have exactly two top-level nodes.");
		return;
	}
	if (logging_store.error_chrome("chrome.bookmarks.getTree")) {
		return;
	}

	const parent = traverse(root.children[0], root.id, 0);
	if (parent?.folder === true) {
		bookmarks_store.parent = parent;
	} else {
		logging_store.error("chrome.bookmarks.getTree: Parent node is not a folder.");
	}
	const others = traverse(root.children[1], root.id, 1);
	if (others?.folder === true) {
		bookmarks_store.others = others;
	} else {
		logging_store.error("chrome.bookmarks.getTree: Others node is not a folder.");
	}
});

function sweep_invalid_bookmarks() {
	for (const id of bookmarks_store.invalid) {
		if (!bookmarks_store.invalid.delete(id)) {
			logging_store.warn(`Concurrent modification of bookmark node #${id}`)
			continue;
		}
		chrome.bookmarks.move(id, {
			parentId: bookmarks_store.others?.id,
		}, () => {
			logging_store.error_chrome("chrome.bookmarks.move");
		});
	}
}
</script>

<template>
	<header class="bg-base-100 navbar shadow-sm">
		<div class="navbar-start">
			<a class="btn btn-ghost text-xl">Bookmark Manager</a>
		</div>
		<div class="navbar-end">
			<label class="label mx-2">
				<input type="checkbox" :checked="preferences_store.folderonly" class="toggle toggle-primary" @click="switch_folderonly()" />
				Folder Only
			</label>
		</div>
	</header>
	<main class="bg-base-100 block px-8">
		<div v-for="(error, index) in logging_store.records.error" :key="`error-${index}`" role="alert" class="alert alert-error">
			<FontAwesomeIcon :icon="faCircleXmark" />
			<span>{{ error }}</span>
		</div>
		<div v-for="(warn, index) in logging_store.records.warn" :key="`warn-${index}`" class="alert alert-warning">
			<FontAwesomeIcon :icon="faCircleExclamation" />
			<span>{{ warn }}</span>
		</div>
		<div v-for="(info, index) in logging_store.records.info" :key="`info-${index}`" class="alert alert-info">
			<FontAwesomeIcon :icon="faCircleInfo" />
			<span>{{ info }}</span>
		</div>
		<div class="card bg-base-200">
			<div class="card-body">
				<h2 class="card-title">Bookmark Tree</h2>
				<ul class="menu w-full">
					<BookmarkTree v-if="bookmarks_store.parent" v-bind="bookmarks_store.parent" />
					<BookmarkTree v-if="bookmarks_store.others" v-bind="bookmarks_store.others" />
				</ul>
			</div>
			<div class="card-actions justify-center px-4 pb-4">
				<button type="button" class="btn btn-primary mx-2" :disabled="bookmarks_store.invalid.size == 0" @click="sweep_invalid_bookmarks()">Clean</button>
			</div>
		</div>
	</main>
</template>
