<script setup lang="ts">
import BookmarkModalComponent from "./components/BookmarkModalComponent.vue";
import BookmarkShowcaseComponent from "./components/BookmarkShowcaseComponent.vue";
import HistoryRuleComponent from "./components/HistoryRuleComponent.vue";
import { use_history_store } from "./stores/history";
import { use_preferences_store } from "./stores/preferences";

const history_store = use_history_store();
const preferences_store = use_preferences_store();

chrome.storage.sync.get<{
	folderonly: boolean;
	historyrules: Record<string, {
		subdomains: boolean;
	}>;
}>({
	folderonly: true,
	historyrules: {},
}).then(({ folderonly, historyrules }) => {
	preferences_store.folderonly = folderonly;
	history_store.rules = historyrules;
}, (reason) => {
	console.error(`chrome.storage.sync.get: ${reason}`);
});

async function switch_folderonly(event: Event) {
	const checkbox = event.target as HTMLInputElement;
	preferences_store.folderonly = checkbox.checked;
	await chrome.storage.sync.set({
		folderonly: checkbox.checked,
	}).catch((reason) => {
		console.error(`chrome.storage.sync.set: ${reason}`);
	});
}

async function run_history_rules() {
	history_store.running = true;
	for (const hostname in history_store.rules) {
		const properties = history_store.rules[hostname];
		if (properties === undefined) {
			console.error(`History rule for ${hostname} is undefined.`);
			continue;
		}
		const pattern = new URLPattern({
			hostname: properties.subdomains ? `(.+\\.)?${hostname}` : hostname,
		});
		const ignored = new Map<string, chrome.history.HistoryItem>();
		let deleted = true;
		while (deleted) {
			deleted = false;
			for (const result of await chrome.history.search({
				text: hostname,
				maxResults: ignored.size + 1000,
				startTime: 0,
			})) {
				if (ignored.has(result.id)) {
					continue;
				}
				if (result.url !== undefined && pattern.test(result.url)) {
					await chrome.history.deleteUrl({ url: result.url });
					deleted = true;
				} else {
					ignored.set(result.id, result);
				}
			}
		}
	}
	history_store.running = false;
}

async function save_history_rules() {
	await chrome.storage.sync.set({
		historyrules: history_store.rules,
	}).catch((reason) => {
		console.error(`chrome.storage.sync.set: ${reason}`);
	});
	history_store.updated = false;
}
</script>

<template>
	<header class="bg-base-100 navbar shadow-sm">
		<div class="navbar-start">
			<a class="btn btn-ghost text-xl">Bookmark Manager</a>
		</div>
		<div class="navbar-end">
			<label class="label mx-2">
				<input type="checkbox" :checked="preferences_store.folderonly" class="toggle toggle-primary" @click="switch_folderonly" />
				Folder Only
			</label>
		</div>
	</header>
	<main class="bg-base-100 block px-8">
		<div class="card bg-base-200 my-2">
			<div class="card-body">
				<h2 class="card-title">Bookmark Tree</h2>
				<Suspense>
					<BookmarkShowcaseComponent />
					<template #fallback>
						<div class="skeleton w-full h-24"></div>
					</template>
				</Suspense>
				<div class="card-actions justify-end">
					<button type="button" class="btn btn-primary" disabled>Save</button>
				</div>
			</div>
		</div>
		<div class="card bg-base-200 my-2">
			<div class="card-body">
				<h2 class="card-title">History Rules</h2>
				<ul class="list">
					<HistoryRuleComponent />
					<HistoryRuleComponent v-for="(properties, hostname, index) in history_store.rules" :key="index" :hostname v-bind="properties" />
				</ul>
				<div class="card-actions justify-end">
					<button type="button" class="btn btn-primary" :disabled="history_store.running" @click="run_history_rules">Run</button>
					<button type="button" class="btn btn-primary" :disabled="!history_store.updated" @click="save_history_rules">Save</button>
				</div>
			</div>
		</div>
	</main>
	<BookmarkModalComponent />
</template>
