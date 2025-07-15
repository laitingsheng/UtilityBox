<script lang="ts">
	import BookmarkTree from "$lib/BookmarkTree.svelte";

	interface Props {
		nodes: chrome.bookmarks.BookmarkTreeNode[];
	}

	const { nodes }: Props = $props();
</script>

{#each nodes as node (node.id)}
{#if node.url === undefined}
<details open>
	<summary>{node.title}</summary>
	<ul>
		<BookmarkTree nodes={node.children || []} />
	</ul>
</details>
{:else}
<a href={node.url}>{node.title}</a>
{/if}
{/each}
