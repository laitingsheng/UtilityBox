<script setup lang="ts">
import { faBookmark, faFolder, faLink, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

defineProps({
	folderonly: {
		type: Boolean,
		required: true,
	},
	nodeid: {
		type: String,
		required: true,
	},
	nodes: {
		type: Array<chrome.bookmarks.BookmarkTreeNode>,
		required: false,
	},
});

const emit = defineEmits<{
	(e: "error", message: string): void;
}>();

function remove_bookmark(id: string) {
	chrome.bookmarks.remove(id, () => {
		if (chrome.runtime.lastError) {
			emit("error", `Failed to remove bookmark: ${chrome.runtime.lastError.message ?? "Unknown error"}`);
		}
	});
}
</script>

<template>
	<template v-for="node in nodes" :key="`bookmark-${node.id}`">
		<li v-if="!node.unmodifiable" :id="`bookmark-${node.id}`" :hidden="node.url && folderonly">
			<a v-if="node.url">
				<FontAwesomeIcon :icon="faBookmark" />
				{{ node.title }}
				<a :href="node.url" target="_blank" class="btn btn-primary btn-xs">
					<FontAwesomeIcon :icon="faLink" />
				</a>
				<button type="button" class="btn btn-primary btn-xs" @click="remove_bookmark(node.id)">
					<FontAwesomeIcon :icon="faMinus" />
				</button>
			</a>
			<details v-else>
				<summary>
					<FontAwesomeIcon :icon="faFolder" />
					{{ node.title }}
					<button type="button" class="btn btn-primary btn-xs" :disabled="node.children?.length !== 0" @click="remove_bookmark(node.id)">
						<FontAwesomeIcon :icon="faMinus" />
					</button>
				</summary>
				<ul>
					<BookmarkTreeItem :folderonly :nodeid="node.id" :nodes="node.children" />
				</ul>
			</details>
		</li>
	</template>
</template>
