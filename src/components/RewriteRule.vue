<script setup lang="ts">
import { use_rewrite_store } from "../stores/rewrite";

const props = defineProps<{
	pattern?: string;
	replace?: string;
}>();

const rewrite_store = use_rewrite_store();

function update_pattern(event: FocusEvent) {
	const input = event.target as HTMLInputElement;
	input.setCustomValidity("");
	if (!input.reportValidity()) {
		return;
	}
	if (input.value.length > 0) {
		try {
			new RegExp(`^${input.value}$`, "v");
		} catch (error) {
			input.setCustomValidity(`${error}`);
			input.reportValidity();
			return;
		}
		const rule = rewrite_store.rules[input.value];
		if (rule === undefined) {
			rewrite_store.rules[input.value] = props.replace;
			rewrite_store.updated = true;
			input.value = "";
		} else if (props.pattern !== input.value) {
			input.setCustomValidity(`Duplicate pattern in rules is not allowed.`);
			input.reportValidity();
			return;
		}
	}
	if (props.pattern !== undefined && props.pattern !== input.value) {
		delete rewrite_store.rules[props.pattern];
		rewrite_store.updated = true;
	}
}

function update_replace(event: FocusEvent) {
	if (props.pattern === undefined) {
		console.error("Unexpected update for replace without pattern.");
		return;
	}
	const input = event.target as HTMLInputElement;
	input.setCustomValidity("");
	if (!input.reportValidity()) {
		return;
	}
	if (props.replace !== input.value) {
		rewrite_store.rules[props.pattern] = input.value;
		rewrite_store.updated = true;
	}
}
</script>

<template>
	<li class="list-row join">
		<label class="input join-item w-full max-w-full">
			Pattern
			<input type="text" placeholder="<Regular Expression>" :value="pattern" autocomplete="off" spellcheck="false" @focusout="update_pattern" />
		</label>
		<label v-if="pattern !== undefined" class="input join-item w-full max-w-full">
			Rewrite
			<input type="text" placeholder="<Replacement String>" required :value="replace" autocomplete="off" spellcheck="false" @focusout="update_replace" />
		</label>
	</li>
</template>
