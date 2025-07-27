<script setup lang="ts">
import { computed } from "vue";

import icons from "../assets/icons";
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
				<button type="button" class="btn btn-ghost btn-xs p-0" @click="bookmarks_store.selected = id">
					{{ icons.FOLDER }}
				</button>
				{{ current.title }}
			</summary>
			<ul>
				<template v-for="child in current.children" :key="child">
					<BookmarkTreeRow :id="child" :folderonly />
				</template>
			</ul>
		</details>
		<a v-else :hidden="folderonly">
			<button type="button" class="btn btn-ghost btn-xs p-0" @click="bookmarks_store.selected = current.id">
				{{ icons.BOOKMARK }}
			</button>
			{{ current.title }}
			<a class="btn btn-info btn-xs" :href="current.url" target="_blank">
				{{ icons.LINK }}
			</a>
		</a>
	</li>
</template>
