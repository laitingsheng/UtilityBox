<script setup lang="ts">
import { faSitemap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { use_history_store } from "../stores/history";

const props = defineProps<{
	hostname?: string;
	subdomains?: boolean;
}>();

const history_store = use_history_store();

function update_hostname(event: FocusEvent) {
	const input = event.target as HTMLInputElement;
	input.setCustomValidity("");
	if (!input.reportValidity()) {
		return;
	}
	if (input.value.length > 0) {
		const rule = history_store.rules[input.value];
		if (rule === undefined) {
			history_store.rules[input.value] = {
				subdomains: false,
			};
			history_store.updated = true;
			input.value = "";
		} else if (props.hostname !== input.value) {
			input.setCustomValidity(`Duplicate hostname in rules is not allowed.`);
			input.reportValidity();
			return;
		}
	}
	if (props.hostname !== undefined && props.hostname !== input.value) {
		delete history_store.rules[props.hostname];
		history_store.updated = true;
	}
}

function update_subdomains(event: Event) {
	if (props.hostname === undefined) {
		console.error("Unexpected change event for subdomains without hostname.");
		return;
	}
	const rule = history_store.rules[props.hostname];
	if (rule === undefined) {
		console.error(`History rule for ${props.hostname} is undefined.`);
		return;
	}
	const checkbox = event.target as HTMLInputElement;
	rule.subdomains = checkbox.checked;
	history_store.updated = true;
}
</script>

<template>
	<li class="list-row join">
		<label class="input validator join-item w-full max-w-full">
			<FontAwesomeIcon :icon="faSitemap" />
			<input type="text" pattern="(?:[\p{L}\p{N}\-]+\.)+[\p{L}\p{N}]{2,}" :value="hostname" @focusout="update_hostname" />
		</label>
		<label v-if="hostname !== undefined" class="label join-item">
			<input type="checkbox" class="toggle" :checked="subdomains" @change="update_subdomains" />
			Subdomains
		</label>
	</li>
</template>
