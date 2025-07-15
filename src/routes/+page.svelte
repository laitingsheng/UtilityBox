<svelte:head>
	<title>Options</title>
</svelte:head>

<script lang="ts">
	import BookmarkTree from "$lib/BookmarkTree.svelte";
</script>

<ul class="menu menu-xs bg-base-100 rounded-box max-w-xs w-full">
{#await chrome.bookmarks.getTree() then root}
<BookmarkTree nodes={root[0].children || []} />
{/await}
</ul>
