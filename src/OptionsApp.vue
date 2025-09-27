<script setup lang="ts">
import CleaningRules from "@/components/CleaningRules.vue";
import { enableediting } from "@/states/preferences";
import { startCase } from "es-toolkit/string";

import package_info from "../package.json";

async function sync_toggle(event: Event): Promise<void> {
	const target = event.target as HTMLInputElement;
	return await chrome.storage.sync
		.set({
			[target.name]: target.checked,
		})
		.catch((reason) => {
			console.error(`chrome.storage.sync.set: ${reason}`);
		});
}
</script>

<template>
	<header class="bg-base-100 navbar shadow-sm">
		<div class="navbar-start">
			<a class="btn btn-ghost text-xl">{{ startCase(package_info.name) }}</a>
		</div>
		<div class="navbar-end">
			<label class="label mx-2">
				<input
					type="checkbox"
					name="enableediting"
					class="toggle toggle-primary"
					v-model="enableediting"
					@click="sync_toggle" />
				Enable Editing
			</label>
		</div>
	</header>
	<main class="bg-base-100 block px-8 space-y-4">
		<CleaningRules />
	</main>
	<BookmarkDetails />
</template>
