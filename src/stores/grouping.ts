import { defineStore } from "pinia";

export interface GroupingRuleProperties {
	subdomains: boolean;
}

export const use_grouping_store = defineStore("grouping", {
	state: () => ({
		ruledefault: {
			subdomains: true,
		} as GroupingRuleProperties,
		rules: {} as Record<string, Record<string, GroupingRuleProperties | undefined> | undefined>,
		updated: false,
		running: false,
	}),
})
