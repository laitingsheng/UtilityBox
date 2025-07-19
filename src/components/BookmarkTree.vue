<script setup lang="ts">
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { BookmarkFolder } from "../stores/bookmarks";
import BookmarkItem from "./BookmarkItem.vue";

defineProps<BookmarkFolder>();
</script>

<template>
	<li :id="`bookmark-folder-${id}`">
		<details>
			<summary>
				<FontAwesomeIcon :icon="faFolder" />
				{{ title }}
			</summary>
			<ul>
				<template v-for="child in children" :key="`bookmark-${child?.id}`">
					<BookmarkTree v-if="child.folder" v-bind="child" />
					<BookmarkItem v-else v-bind="child" />
				</template>
			</ul>
		</details>
	</li>
</template>
