import { defineStore } from "pinia";

import type { CleaningRuleProperties } from "@/types/cleaning";

export const use_cleaning_store = defineStore("cleaning", {
	state: () => ({
		ruledefault: {
			subdomains: true,
			bookmarks: false,
			history: true,
		} as CleaningRuleProperties,
		rules: {} as Record<string, CleaningRuleProperties | undefined>,
		updated: false,
		bookmarks: false,
		history: false,
	}),
});
