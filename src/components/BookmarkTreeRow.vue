<script setup lang="ts">
import { faBookmark, faFolder, faInfo, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed } from "vue";

import { use_bookmarks_store } from "../stores/bookmarks";

const props = defineProps<{
	id?: string;
	folderonly: boolean;
}>();

const bookmarks_store = use_bookmarks_store();

const current = computed(() => props.id === undefined ? undefined : bookmarks_store.bookmarks[props.id]);
</script>

<template>
	<li v-if="current === undefined" class="skeleton w-full h-4"></li>
	<li v-else>
		<details v-if="current.folder">
			<summary>
				<FontAwesomeIcon :icon="faFolder" />
				{{ current.title }}
				<button type="button" class="btn btn-primary btn-xs" @click="bookmarks_store.selected = id">
					<FontAwesomeIcon :icon="faInfo" />
				</button>
			</summary>
			<ul>
				<template v-for="child in current.children" :key="child">
					<BookmarkTreeRow :id="child" :folderonly />
				</template>
			</ul>
		</details>
		<a v-else :hidden="folderonly">
			<FontAwesomeIcon :icon="faBookmark" />
			{{ current.title }}
			<button type="button" class="btn btn-primary btn-xs" @click="bookmarks_store.selected = current.id">
				<FontAwesomeIcon :icon="faInfo" />
			</button>
			<a class="btn btn-info btn-xs" :href="current.url" target="_blank">
				<FontAwesomeIcon :icon="faLink" />
			</a>
		</a>
	</li>
</template>
