<script setup lang="ts">
import { faBookmark, faCircleExclamation, faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { BookmarkFolder } from "../stores/bookmarks";
import BookmarkItem from "./BookmarkItem.vue";

defineProps<BookmarkFolder>();
</script>

<template>
	<li :id="`bookmark-folder-${id}`">
		<details>
			<summary>
				<FontAwesomeIcon :icon="folder ? faFolder : faBookmark" />
				{{ title }}
			</summary>
			<ul>
				<template v-for="(child, index) in children">
					<a v-if="child === undefined" :key="`${id}-filtered-${index}`" role="alert" class="alert alert-warning alert-soft">
						<FontAwesomeIcon :icon="faCircleExclamation" />
						&lt;Filtered Bookmark&gt;
					</a>
					<BookmarkTree v-else-if="child.folder" :key="`bookmark-folder-${child?.id}`" v-bind="child" />
					<BookmarkItem v-else :key="`bookmark-item-${child?.id}`" v-bind="child" />
				</template>
			</ul>
		</details>
	</li>
</template>
