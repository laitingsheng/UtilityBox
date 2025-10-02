import type { CleaningRuleProperties } from "@/types/cleaning";
import type { Message, MessageResponse } from "@/types/messages";

const cleaning = {
	bookmarks: false,
	history: false,
};

async function clean_bookmarks(): Promise<void> {
	const { cleaningrules } = await chrome.storage.sync.get<{
		cleaningrules: Record<string, CleaningRuleProperties>;
	}>({
		cleaningrules: {},
	});
	for (const hostname in cleaningrules) {
		const properties = cleaningrules[hostname];
		if (!properties.bookmarks) {
			continue;
		}
		for (const result of await chrome.bookmarks.search({
			query: hostname,
		})) {
			if (result.url === undefined) {
				continue;
			}
			const url = new URL(result.url);
			if (url.hostname === hostname || (properties.subdomains && url.hostname.endsWith(`.${hostname}`))) {
				console.info(`Deleting bookmark #${result.id}: ${result.url}...`);
				await chrome.bookmarks.remove(result.id);
			}
		}
	}
	cleaning.bookmarks = false;
}

async function clean_history(): Promise<void> {
	const { cleaningrules } = await chrome.storage.sync.get<{
		cleaningrules: Record<string, CleaningRuleProperties>;
	}>({
		cleaningrules: {},
	});
	for (const hostname in cleaningrules) {
		const properties = cleaningrules[hostname];
		if (!properties.history) {
			continue;
		}
		const results = await chrome.history.search({
			text: hostname,
			maxResults: 1e9,
		});
		for (const result of results) {
			if (result.url === undefined) {
				continue;
			}
			const url = new URL(result.url);
			if (url.hostname === hostname || (properties.subdomains && url.hostname.endsWith(`.${hostname}`))) {
				console.info(`Deleting history entry for ${result.url}...`);
				await chrome.history.deleteUrl({ url: result.url });
			}
		}
	}
	cleaning.history = false;
}

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
	if (sender.id !== chrome.runtime.id) {
		console.warn(`Received message from unknown sender: ${sender.id}`);
		return;
	}
	switch (message.type) {
		case "clean.bookmarks": {
			if (cleaning.bookmarks) {
				sendResponse({
					status: "running",
				} as MessageResponse);
			} else {
				cleaning.bookmarks = true;
				sendResponse({
					status: "started",
				} as MessageResponse);
				clean_bookmarks();
			}
			return;
		}
		case "clean.history": {
			if (cleaning.history) {
				sendResponse({
					status: "running",
				} as MessageResponse);
			} else {
				cleaning.history = true;
				sendResponse({
					status: "started",
				} as MessageResponse);
				clean_history();
			}
			return;
		}
	}
});

chrome.history.onVisited.addListener(async (result) => {
	if (result.url === undefined) {
		return;
	}
	const { cleaningrules } = await chrome.storage.sync.get<{
		cleaningrules: Record<string, CleaningRuleProperties>;
	}>({
		cleaningrules: {},
	});
	for (const hostname in cleaningrules) {
		const properties = cleaningrules[hostname];
		if (!properties.history) {
			continue;
		}
		const url = new URL(result.url);
		if (url.hostname === hostname || (properties.subdomains && url.hostname.endsWith(`.${hostname}`))) {
			console.info(`Deleting visited history entry for ${result.url}...`);
			await chrome.history.deleteUrl({ url: result.url });
			return;
		}
	}
});
