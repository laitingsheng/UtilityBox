<script setup lang="ts">
import { use_grouping_store, type GroupingRuleProperties } from "../stores/grouping";

const props = defineProps<{
	id: string;
	hostname?: string;
} & Partial<GroupingRuleProperties>>();

const grouping_store = use_grouping_store();

function update_hostname(event: FocusEvent) {
	const input = event.target as HTMLInputElement;
	input.setCustomValidity("");
	if (!input.reportValidity()) {
		return;
	}
	let rules = grouping_store.rules[props.id];
	if (rules === undefined) {
		rules = {};
		grouping_store.rules[props.id] = rules;
	}
	if (input.value.length > 0) {
		const rule = rules[input.value];
		if (rule === undefined) {
			rules[input.value] = Object.assign({}, grouping_store.ruledefault);
			grouping_store.updated = true;
			input.value = "";
		} else if (props.hostname !== input.value) {
			input.setCustomValidity(`Duplicate hostname in rules is not allowed.`);
			input.reportValidity();
			return;
		}
	}
	if (props.hostname !== undefined && props.hostname !== input.value) {
		delete rules[props.hostname];
		grouping_store.updated = true;
	}
}

function update_subdomains(event: Event) {
	const checkbox = event.target as HTMLInputElement;
	if (props.hostname === undefined) {
		grouping_store.ruledefault.subdomains = checkbox.checked;
		grouping_store.updated = true;
		return;
	}
	const rules = grouping_store.rules[props.id];
	if (rules === undefined) {
		console.error(`Grouping rule for ${props.id} is undefined.`);
		return;
	}
	const rule = rules[props.hostname];
	if (rule === undefined) {
		console.error(`Grouping rule for ${props.hostname} in ${props.id} is undefined.`);
		return;
	}
	rule.subdomains = checkbox.checked;
	grouping_store.updated = true;
}
</script>

<template>
	<li class="list-row join">
		<label class="input validator join-item w-full max-w-full">
			Hostname
			<input type="text" pattern="(?:[\p{L}\p{N}\-]+\.)+[\p{L}\p{N}]{2,}" placeholder="example.com" autocomplete="off" spellcheck="false" :value="hostname" @focusout="update_hostname" />
		</label>
		<label class="label join-item">
			<input type="checkbox" class="toggle" :checked="subdomains" @change="update_subdomains" />
			Subdomains
		</label>
	</li>
</template>
