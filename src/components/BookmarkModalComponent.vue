<script setup lang="ts">
import { use_bookmarks_store } from "../stores/bookmarks";
import BookmarkBaseAttributesComponent from "./BookmarkBaseAttributesComponent.vue";
import BookmarkFolderAttributesComponent from "./BookmarkFolderAttributesComponent.vue";
import BookmarkItemAttributesComponent from "./BookmarkItemAttributesComponent.vue";

const bookmarks_store = use_bookmarks_store();
</script>

<template>
	<dialog v-if="bookmarks_store.selected !== undefined" class="modal" open @close="bookmarks_store.selected_id = undefined">
		<form method="dialog" class="modal-box card-body">
			<h2 class="card-title">Attributes</h2>
			<BookmarkBaseAttributesComponent v-bind="bookmarks_store.selected" />
			<component :is="bookmarks_store.selected.folder ? BookmarkFolderAttributesComponent : BookmarkItemAttributesComponent" v-bind="bookmarks_store.selected" />
			<div class="card-actions justify-end">
				<button type="submit" class="btn">Close</button>
			</div>
		</form>
		<form method="dialog" class="modal-backdrop">
			<button type="submit"></button>
		</form>
	</dialog>
</template>
