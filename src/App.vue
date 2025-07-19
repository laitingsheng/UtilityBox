<script setup lang="ts">
import BookmarkShowcaseComponent from "./components/BookmarkShowcaseComponent.vue";
import { use_preferences_store } from "./stores/preferences";

const preferences_store = use_preferences_store();

chrome.storage.sync.get({
	folderonly: true,
}).then(({ folderonly }) => {
	preferences_store.folderonly = folderonly;
}, (reason) => {
	console.error(`chrome.storage.sync.get: ${reason}`);
});

async function switch_folderonly() {
	preferences_store.folderonly = !preferences_store.folderonly;
	return await chrome.storage.sync.set({
		folderonly: preferences_store.folderonly,
	}).catch((reason) => {
		console.error(`chrome.storage.sync.set: ${reason}`);
	});
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
		<div class="card bg-base-200">
			<div class="card-body">
				<h2 class="card-title">Bookmark Tree</h2>
				<ul class="menu w-full">
					<Suspense>
						<BookmarkShowcaseComponent />
						<template #fallback>
							<div class="skeleton w-full h-16"></div>
						</template>
					</Suspense>
				</ul>
				<div class="card-actions justify-end">
					<button type="button" class="btn btn-primary" disabled>Save</button>
				</div>
			</div>
		</div>
	</main>
</template>
