import { defineStore } from "pinia";
import { ref } from "vue";

export const use_preferences_store = defineStore("preferences", () => {
	const folderonly = ref(true);

	return {
		folderonly,
	};
});
