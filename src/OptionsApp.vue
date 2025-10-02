<script setup lang="ts">
import CleaningRules from "@/components/CleaningRules.vue";

const message_name = chrome.i18n.getMessage("name");
</script>

<template>
	<header class="bg-base-100 navbar shadow-sm">
		<div class="navbar-start">
			<a class="btn btn-ghost text-xl">{{ message_name }}</a>
		</div>
	</header>
	<main class="bg-base-100 block px-8 space-y-4">
		<CleaningRules />
	</main>
	<BookmarkDetails />
</template>
