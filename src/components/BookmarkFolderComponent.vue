<script setup lang="ts">
import { faFolder, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { use_bookmarks_store, type BookmarkFolder } from "../stores/bookmarks";
import BookmarkFolderComponent from "./BookmarkFolderComponent.vue";
import BookmarkItemComponent from "./BookmarkItemComponent.vue";

defineProps<BookmarkFolder>();

const bookmarks_store = use_bookmarks_store();
</script>

<template>
	<li>
		<details>
			<summary>
				<FontAwesomeIcon :icon="faFolder" />
				{{ title }}
				<button type="button" class="btn btn-primary btn-xs border-0 m-0" @click="bookmarks_store.selected_id = id">
					<FontAwesomeIcon :icon="faPencil" />
				</button>
			</summary>
			<ul>
				<template v-for="child in children" :key="child.id">
					<component :is="child.folder ? BookmarkFolderComponent : BookmarkItemComponent" v-bind="child" />
				</template>
			</ul>
		</details>
	</li>
</template>
