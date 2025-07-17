import { defineStore } from "pinia";
import { reactive, ref } from "vue";

interface BookmarkBase {
	readonly immutable: boolean;
	readonly id: string;
	parent_id: string;
	title: string;
	readonly added: Date;
}

export interface BookmarkItem extends BookmarkBase {
	folder: false;
	url: URL;
	readonly last_used: Date;
}

export interface BookmarkFolder extends BookmarkBase {
	folder: true;
	children: Array<Bookmark | undefined>;
	readonly last_modified: Date;
}

export type Bookmark = BookmarkItem | BookmarkFolder;

export const use_bookmarks_store = defineStore("bookmarks", () => {
	const parent = ref<BookmarkFolder>();
	const others = ref<BookmarkFolder>();
	const bookmarks = ref<Record<string, Bookmark | undefined>>({});
	const invalid = reactive(new Set<string>());

	return {
		parent,
		others,
		bookmarks,
		invalid,
	};
});
