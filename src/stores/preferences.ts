import { defineStore } from "pinia";

export const use_preferences_store = defineStore("preferences", {
	state: () => ({
		folderonly: true,
	}),
});
