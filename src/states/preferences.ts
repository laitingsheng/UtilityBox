import { ref } from "vue";

export const enableediting = ref(false);
export const folderonly = ref(true);

chrome.storage.sync.get({
	enableediting: false,
	folderonly: true,
}).then((stored) => {
	enableediting.value = stored.enableediting;
	folderonly.value = stored.folderonly;
}, (reason) => {
	console.error(`chrome.storage.sync.get: ${reason}`);
});

chrome.storage.sync.onChanged.addListener((changes) => {
	if (changes.enableediting?.newValue !== null && changes.enableediting?.newValue !== undefined) {
		enableediting.value = changes.enableediting.newValue;
	}

	if (changes.folderonly?.newValue !== null && changes.folderonly?.newValue !== undefined) {
		folderonly.value = changes.folderonly.newValue;
	}
});
