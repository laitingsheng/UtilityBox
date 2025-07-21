import { defineStore } from "pinia";

export const use_history_store = defineStore("history", {
	state: () => ({
		rules: {} as Record<string, {
			subdomains: boolean;
		} | undefined>,
		updated: false,
		running: false,
	}),
});
