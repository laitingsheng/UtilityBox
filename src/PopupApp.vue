<script setup lang="ts">
import icons from "@/assets/icons";
import type { Message, MessageResponse } from "@/types/messages";

async function request_clean_bookmarks(): Promise<void> {
	switch ((await chrome.runtime.sendMessage({
		type: "clean.bookmarks",
	} as Message) as MessageResponse).status) {
		case "started":
			console.info("Bookmarks cleaning started.");
			break;
		case "running":
			console.warn("Bookmarks cleaning is already running.");
			break;
		default:
			console.error("Unexpected response from bookmarks cleaning request.");
			break;
	}
}

async function request_clean_history(): Promise<void> {
	switch ((await chrome.runtime.sendMessage({
		type: "clean.history",
	} as Message) as MessageResponse).status) {
		case "started":
			console.info("History cleaning started.");
			break;
		case "running":
			console.warn("History cleaning is already running.");
			break;
		default:
			console.error("Unexpected response from history cleaning request.");
			break;
	}
}

async function open_options(): Promise<void> {
	return await chrome.runtime.openOptionsPage();
}
</script>

<style module>
html {
	min-width: 200px;
}
</style>

<template>
	<main class="bg-base-100 block">
		<ul class="menu w-full">
			<li><a @click="request_clean_bookmarks"><span class="text-center w-4">{{ icons.BROOM }}</span> Clean Bookmarks</a></li>
			<li><a @click="request_clean_history"><span class="text-center w-4">{{ icons.BROOM }}</span> Clean History</a></li>
			<li><a @click="open_options"><span class="text-center w-4">{{ icons.GEAR }}</span> Options</a></li>
		</ul>
	</main>
</template>
