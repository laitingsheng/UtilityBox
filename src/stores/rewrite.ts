import { defineStore } from "pinia";

export const use_rewrite_store = defineStore("rewrite", {
	state: () => ({
		rules: {} as Record<string, string | undefined>,
		updated: false,
		running: false,
	}),
});
