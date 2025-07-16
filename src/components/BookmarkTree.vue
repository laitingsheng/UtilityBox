<script setup lang="ts">
import BookmarkTreeItem from "./BookmarkTreeItem.vue";

defineProps({
	folderonly: {
		type: Boolean,
		required: true,
	},
	nodeid: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	nodes: {
		type: Array<chrome.bookmarks.BookmarkTreeNode>,
		required: false,
	},
});

defineEmits<{
	(e: "error", message: string): void;
}>();
</script>

<template>
	<div class="card card-border bg-base-200 w-full my-8">
		<div class="card-body">
			<h2 class="card-title">{{ title }}</h2>
			<ul v-if="nodes?.length !== 0" class="menu w-full">
				<BookmarkTreeItem :folderonly :nodeid :nodes @error="(m) => $emit('error', m)" />
			</ul>
		</div>
		<div class="card-actions justify-center px-4 pb-4">
			<a class="btn btn-primary">Save</a>
		</div>
	</div>
</template>
