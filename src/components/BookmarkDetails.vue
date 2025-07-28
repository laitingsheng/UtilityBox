<script setup lang="ts">
import { computed } from "vue";

import { enableediting } from "../states/preferences";
import { use_bookmarks_store } from "../stores/bookmarks";
import icons from "../assets/icons";

const bookmarks_store = use_bookmarks_store();

const selected = computed(() => bookmarks_store.selected === undefined ? undefined : bookmarks_store.bookmarks[bookmarks_store.selected]);
const immutable = computed(() => !enableediting.value || selected.value === undefined || selected.value.immutable);

async function update_title(event: FocusEvent): Promise<void> {
	if (immutable.value) {
		return;
	}
	const target = event.target as HTMLInputElement;
	if (!target.reportValidity() || target.value === selected.value!.title) {
		return;
	}
	await chrome.bookmarks.update(selected.value!.id, {
		title: target.value,
	}).catch((reason) => {
		console.error(`chrome.bookmarks.update: ${reason}`);
	});
}

async function update_url(event: FocusEvent): Promise<void> {
	if (immutable.value) {
		return;
	}
	if (selected.value!.folder) {
		console.error(`Unexpected URL update for folder #${selected.value!.id}.`);
		return;
	}
	const target = event.target as HTMLInputElement;
	if (!target.reportValidity() || target.value === selected.value!.url) {
		return;
	}
	await chrome.bookmarks.update(selected.value!.id, {
		url: target.value,
	}).catch((reason) => {
		console.error(`chrome.bookmarks.update: ${reason}`);
	});
}
</script>

<template>
	<dialog v-if="selected !== undefined" class="modal" open @close="bookmarks_store.selected = undefined">
		<form method="dialog" class="modal-box card-body max-w-full">
			<h2 class="card-title">
				<span class="text-center w-4">{{ selected.folder ? icons.FOLDER : icons.BOOKMARK }}</span> #{{ selected.id }}
			</h2>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Attributes</legend>
				<label class="input w-full max-w-full">
					<span class="w-30">Title</span>
					<input type="text" class="input input-bordered w-full max-w-full" :readonly="immutable" required :value="selected.title" @focusout="update_title" />
				</label>
				<label class="input w-full max-w-full">
					<span class="w-30">Added</span>
					<input type="text" class="input input-bordered w-full max-w-full" readonly :value="selected.added?.toLocaleString()" />
				</label>
				<template v-if="selected.folder">
					<label class="input w-full max-w-full">
						<span class="w-30">Last Modified</span>
						<input type="text" class="input input-bordered w-full max-w-full" readonly :value="selected.last_modified?.toLocaleString()" />
					</label>
				</template>
				<template v-else>
					<label class="input w-full max-w-full">
						<span class="w-30">URL</span>
						<input type="url" class="input input-bordered w-full max-w-full" :readonly="immutable" required :value="selected.url" @focusout="update_url" />
					</label>
					<label class="input w-full max-w-full">
						<span class="w-30">Last Used</span>
						<input type="text" class="input input-bordered w-full max-w-full" readonly :value="selected.last_used?.toLocaleString()" />
					</label>
				</template>
			</fieldset>
		</form>
		<form method="dialog" class="modal-backdrop">
			<button type="submit"></button>
		</form>
	</dialog>
</template>
