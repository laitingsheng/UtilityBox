<script setup lang="ts">
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { BookmarkItem } from "../stores/bookmarks";
import { use_preferences_store } from "../stores/preferences";

defineProps<BookmarkItem>();

const preferences_store = use_preferences_store();
</script>

<template>
	<li :id="`bookmark-item-${id}`">
		<a :hidden="preferences_store.folderonly">
			<FontAwesomeIcon :icon="faBookmark" />
			{{ title }}
		</a>
	</li>
</template>
