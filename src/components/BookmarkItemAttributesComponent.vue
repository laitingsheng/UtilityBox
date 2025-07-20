<script setup lang="ts">
import { faClockRotateLeft, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { BookmarkItem } from "../stores/bookmarks";

const props = defineProps<BookmarkItem>();

async function update_url(event: FocusEvent) {
	const input = event.target as HTMLInputElement;
	if (input.reportValidity() && input.value !== props.url) {
		await chrome.bookmarks.update(props.id, { url: input.value }).catch((reason) => {
			console.error(`chrome.bookmarks.update: ${reason}`);
		});
	}
}
</script>

<template>
	<fieldset class="fieldset">
		<legend class="fieldset-legend">Item</legend>
		<label class="input w-full max-w-full">
			<FontAwesomeIcon :icon="faClockRotateLeft" />
			<input :id="`bookmark-${id}-last-used`" type="text" class="grow" readonly autocomplete="off" :value="last_used.toLocaleString()" />
		</label>
		<label class="input w-full max-w-full">
			<FontAwesomeIcon :icon="faLink" />
			<input :id="`bookmark-${id}-url`" type="url" class="grow" :readonly="immutable" autocomplete="off" :value="url" minlength="1" @focusout="update_url" />
		</label>
	</fieldset>
</template>
