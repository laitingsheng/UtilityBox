<script setup lang="ts">
import { faFileImport, faHashtag, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { Bookmark } from "../stores/bookmarks";

const props = defineProps<Bookmark>();

async function update_tile(event: FocusEvent) {
	const input = event.target as HTMLInputElement;
	if (input.reportValidity() && input.value !== props.title) {
		await chrome.bookmarks.update(props.id, { title: input.value }).catch((reason) => {
			console.error(`chrome.bookmarks.update: ${reason}`);
		});
	}
}
</script>

<template>
	<fieldset class="fieldset">
		<legend class="fieldset-legend">Basic</legend>
		<label class="input w-full max-w-full">
			<FontAwesomeIcon :icon="faHashtag" />
			<input type="text" class="grow" autocomplete="off" readonly :value="id" />
		</label>
		<label class="input w-full max-w-full">
			<FontAwesomeIcon :icon="faQuoteLeft" />
			<input type="text validator" class="grow" :readonly="immutable" required autocomplete="off" :value="title" @focusout="update_tile" />
		</label>
		<label class="input w-full max-w-full">
			<FontAwesomeIcon :icon="faFileImport" />
			<input type="text" class="grow" readonly autocomplete="off" :value="added.toLocaleString()" />
		</label>
	</fieldset>
</template>
