<script setup lang="ts">
import icons from "../assets/icons";
import { use_bookmarks_store } from "../stores/bookmarks";
import { use_rewrite_store } from "../stores/rewrite";
import RewriteRule from "./RewriteRule.vue";

const bookmarks_store = use_bookmarks_store();
const rewrite_store = use_rewrite_store();

chrome.storage.sync.get<{
	rewriterules: Record<string, string>;
}>({
	rewriterules: {},
}).then(({ rewriterules }) => {
	rewrite_store.rules = rewriterules;
}, (reason) => {
	console.error(`chrome.storage.sync.get: ${reason}`);
});

async function rewrite_bookmarks_urls() {
	rewrite_store.running = true;
	const compiled = new Array<[RegExp, string]>();
	for (const pattern in rewrite_store.rules) {
		const replace = rewrite_store.rules[pattern];
		if (replace === undefined || replace.length === 0) {
			continue;
		}
		compiled.push([new RegExp(`^${pattern}$`, "v"), replace]);
	}
	for (const id in bookmarks_store.bookmarks) {
		const bookmark = bookmarks_store.bookmarks[id];
		if (bookmark?.folder !== false) {
			continue;
		}
		for (const [pattern, replace] of compiled) {
			const url = bookmark.url.replace(pattern, replace);
			if (url !== bookmark.url) {
				console.info(`Rewriting bookmark #${id} URL from ${bookmark.url} to ${url}...`);
				await chrome.bookmarks.update(id, { url });
				break;
			}
		}
	}
	rewrite_store.running = false;
}

async function save_rewrite_rules() {
	await chrome.storage.sync.set({
		rewriterules: rewrite_store.rules,
	}).catch((reason) => {
		console.error(`chrome.storage.sync.set: ${reason}`);
	});
	rewrite_store.updated = false;
}
</script>

<template>
	<div class="card bg-base-200 my-4">
		<div class="card-body">
			<h2 class="card-title">
				{{ icons.MAGIC }} Bookmarks URL Rewrite Rules
				<span class="badge badge-warning">Advanced</span>
				<span class="badge badge-warning">Use with cautions</span>
			</h2>
			<ul class="list">
				<RewriteRule />
				<RewriteRule v-for="(replace, pattern, index) in rewrite_store.rules" :key="index" :pattern :replace />
			</ul>
			<div class="card-actions justify-end">
				<button type="button" class="btn btn-primary" :disabled="rewrite_store.running" @click="rewrite_bookmarks_urls">Run</button>
				<button type="button" class="btn btn-primary" :disabled="!rewrite_store.updated" @click="save_rewrite_rules">Save</button>
			</div>
		</div>
	</div>
</template>
