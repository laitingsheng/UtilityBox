<script setup lang="ts">
import { faBookmark, faLink, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { use_bookmarks_store, type BookmarkItem } from "../stores/bookmarks";
import { use_preferences_store } from "../stores/preferences";

defineProps<BookmarkItem>();

const bookmarks_store = use_bookmarks_store();
const preferences_store = use_preferences_store();
</script>

<template>
	<li :id="`bookmark-item-${id}`">
		<a :hidden="preferences_store.folderonly">
			<FontAwesomeIcon :icon="faBookmark" />
			{{ title }}
			<button type="button" class="btn btn-primary btn-xs border-0 m-0" @click="bookmarks_store.selected_id = id">
				<FontAwesomeIcon :icon="faPencil" />
			</button>
			<a class="btn btn-info btn-xs border-0 m-0" :href="url" target="_blank">
				<FontAwesomeIcon :icon="faLink" />
			</a>
		</a>
	</li>
</template>
