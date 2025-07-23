import { defineStore } from "pinia";

export interface CleaningRuleProperties {
	subdomains: boolean;
	bookmarks: boolean;
	history: boolean;
}

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
