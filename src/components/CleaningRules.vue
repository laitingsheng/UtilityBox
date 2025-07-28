<script setup lang="ts">
import icons from "../assets/icons";
import { use_cleaning_store, type CleaningRuleProperties } from "../stores/cleaning";
import CleaningRule from "./CleaningRule.vue";

const cleaning_store = use_cleaning_store();

chrome.storage.sync.get<{
	cleaningrules: Record<string, CleaningRuleProperties>;
	cleaningruledefault: CleaningRuleProperties;
}>({
	cleaningrules: {},
	cleaningruledefault: {
		subdomains: true,
		bookmarks: false,
		history: true,
	},
}).then(({ cleaningrules, cleaningruledefault }) => {
	cleaning_store.rules = cleaningrules;
	cleaning_store.ruledefault = cleaningruledefault;
}, (reason) => {
	console.error(`chrome.storage.sync.get: ${reason}`);
});

async function clean_bookmarks() {
	cleaning_store.bookmarks = true;
	for (const hostname in cleaning_store.rules) {
		const properties = cleaning_store.rules[hostname];
		if (properties === undefined) {
			console.error(`Cleaning rule for ${hostname} is undefined.`);
			continue;
		}
		if (!properties.bookmarks) {
			continue;
		}
		const pattern = new RegExp(`^https?://${properties.subdomains ? "(?:.+\\.)?" : ""}${hostname}(?:$|[/?#:])`);
		for (const result of await chrome.bookmarks.search({
			query: hostname,
		})) {
			if (result.url !== undefined && pattern.test(result.url)) {
				console.info(`Deleting bookmark #${result.id}: ${result.url}...`);
				await chrome.bookmarks.remove(result.id);
			}
		}
	}
	cleaning_store.bookmarks = false;
}

async function clean_history() {
	cleaning_store.history = true;
	for (const hostname in cleaning_store.rules) {
		const properties = cleaning_store.rules[hostname];
		if (properties === undefined) {
			console.error(`Cleaning rule for ${hostname} is undefined.`);
			continue;
		}
		if (!properties.history) {
			continue;
		}
		const pattern = new RegExp(`^https?://${properties.subdomains ? "(?:.+\\.)?" : ""}${hostname}(?:$|[/?#:])`);
		for (const result of await chrome.history.search({
			text: hostname,
			maxResults: 1e9,
			startTime: 0,
		})) {
			if (result.url !== undefined && pattern.test(result.url)) {
				console.info(`Deleting history entry #${result.id}: ${result.url}...`);
				await chrome.history.deleteUrl({ url: result.url });
			}
		}
	}
	cleaning_store.history = false;
}

async function save_cleaning_rules() {
	await chrome.storage.sync.set({
		cleaningruledefault: cleaning_store.ruledefault,
		cleaningrules: cleaning_store.rules,
	}).catch((reason) => {
		console.error(`chrome.storage.sync.set: ${reason}`);
	});
	cleaning_store.updated = false;
}
</script>

<template>
	<div class="card bg-base-200">
		<div class="card-body">
			<h2 class="card-title">{{ icons.BROOM }} Cleaning Rules</h2>
			<ul class="list">
				<CleaningRule v-bind="cleaning_store.ruledefault" />
				<CleaningRule v-for="(properties, hostname, index) in cleaning_store.rules" :key="index" :hostname v-bind="properties" />
			</ul>
			<div class="card-actions justify-end">
				<button type="button" class="btn btn-primary" :disabled="cleaning_store.bookmarks" @click="clean_bookmarks">Clean Bookmarks</button>
				<button type="button" class="btn btn-primary" :disabled="cleaning_store.history" @click="clean_history">Clean History</button>
				<button type="button" class="btn btn-primary" :disabled="!cleaning_store.updated" @click="save_cleaning_rules">Save</button>
			</div>
		</div>
	</div>
</template>
