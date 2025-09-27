import { ref } from "vue";

export const enableediting = ref(false);

chrome.storage.sync
	.get({
		enableediting: false,
	})
	.then(
		(stored) => {
			enableediting.value = stored.enableediting;
		},
		(reason) => {
			console.error(`chrome.storage.sync.get: ${reason}`);
		},
	);

chrome.storage.sync.onChanged.addListener((changes) => {
	switch (changes.enableediting?.newValue) {
		case true:
			enableediting.value = true;
			break;
		case false:
			enableediting.value = false;
			break;
	}
});
