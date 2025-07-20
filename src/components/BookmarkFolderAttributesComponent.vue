<script setup lang="ts">
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { BookmarkFolder } from "../stores/bookmarks";

defineProps<BookmarkFolder>();
</script>

<template>
	<fieldset class="fieldset">
		<legend class="fieldset-legend">Folder</legend>
		<label class="input w-full max-w-full">
			<FontAwesomeIcon :icon="faClockRotateLeft" />
			<input :id="`bookmark-${id}-last-used`" type="text" class="grow" readonly autocomplete="off" :value="last_modified.toLocaleString()" />
		</label>
	</fieldset>
</template>
