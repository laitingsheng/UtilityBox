<script setup lang="ts">
import { reactive, ref } from "vue";
import { faBug, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import BookmarkTree from "./components/BookmarkTree.vue";

const invalid = ref(false);
const bookmarks = ref<chrome.bookmarks.BookmarkTreeNode>();
const others = ref<chrome.bookmarks.BookmarkTreeNode>();

const errors = reactive<Array<string>>([]);

chrome.bookmarks.getTree((nodes) => {
	if (nodes.length !== 1) {
		invalid.value = true;
		return;
	}
	const root = nodes[0];
	if (root.children?.length !== 2) {
		invalid.value = true;
		return;
	}
	if (chrome.runtime.lastError) {
		errors.push(`Failed to retrieve bookmarks: ${chrome.runtime.lastError.message ?? "Unknown error"}`);
		return;
	}
	bookmarks.value = root.children[0];
	others.value = root.children[1];
});

const folderonly = ref(true);
</script>

<template>
	<header class="bg-base-100 navbar shadow-sm">
		<div class="navbar-start">
			<a class="btn btn-ghost text-xl">Bookmark Manager</a>
		</div>
		<div class="navbar-end">
			<label class="label mx-2">
				<input type="checkbox" :checked="folderonly" class="toggle toggle-primary" @click="folderonly = !folderonly" />
				Folder Only
			</label>
		</div>
	</header>
	<main class="bg-base-100 block px-8">
		<div v-if="invalid" role="alert" class="alert alert-error">
			<FontAwesomeIcon :icon="faCircleXmark" />
			<span>Unexpected bookmark tree structure</span>
		</div>
		<div v-for="(error, index) in errors" :key="`error-${index}`" role="alert" class="alert alert-error">
			<FontAwesomeIcon :icon="faBug" />
			<span>{{ error }}</span>
		</div>
		<BookmarkTree v-if="bookmarks" :folderonly :nodeid="bookmarks.id" :title="bookmarks.title" :nodes="bookmarks.children" @error="(m) => errors.push(m)" />
		<BookmarkTree v-if="others" :folderonly :nodeid="others.id" :title="others.title" :nodes="others.children" @error="(m) => errors.push(m)" />
	</main>
</template>
