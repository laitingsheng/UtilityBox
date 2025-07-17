import { defineStore } from "pinia";
import { reactive } from "vue";

export const use_logging_store = defineStore("logging", () => {
	const records = reactive({
		info: [] as string[],
		warn: [] as string[],
		error: [] as string[],
	});

	function info(message: string) {
		records.info.push(message);
	}

	function warn(message: string) {
		records.warn.push(message);
	}

	function error(message: string) {
		records.error.push(message);
	}

	function error_chrome(caller: string): boolean {
		if (chrome.runtime.lastError !== undefined) {
			error(`${caller}: ${chrome.runtime.lastError.message ?? "Unknown error"}`);
			return true;
		}
		return false;
	}

	return {
		records,
		info,
		warn,
		error,
		error_chrome,
	};
});
