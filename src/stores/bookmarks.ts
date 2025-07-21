import { defineStore } from "pinia";

interface BookmarkBase {
	readonly immutable: boolean;
	readonly id: string;
	title: string;
	readonly added: Date;
}

export interface BookmarkFolder extends BookmarkBase {
	folder: true;
	children: Array<Bookmark>;
	readonly last_modified: Date;
}

export interface BookmarkItem extends BookmarkBase {
	folder: false;
	url: string;
	readonly last_used: Date;
}

export type Bookmark = BookmarkItem | BookmarkFolder;

export const use_bookmarks_store = defineStore("bookmarks", {
	state: () => ({
		parent: undefined as BookmarkFolder | undefined,
		others: undefined as BookmarkFolder | undefined,
		bookmarks: {} as Record<string, Bookmark | undefined>,
		selected_id: undefined as string | undefined,
	}),

	getters: {
		selected: (state) => {
			if (state.selected_id === undefined) {
				return undefined;
			}
			return state.bookmarks[state.selected_id];
		},
	},

	actions: {
		traverse(node: chrome.bookmarks.BookmarkTreeNode): Bookmark {
			let bookmark = this.bookmarks[node.id];
			if (bookmark !== undefined) {
				return bookmark;
			}
			if (node.url === undefined) {
				bookmark = {
					immutable: node.unmodifiable !== undefined,
					id: node.id,
					title: node.title,
					added: new Date(node.dateAdded ?? 0),
					folder: true,
					children: node.children?.map((child) => this.traverse(child)) ?? [],
					last_modified: new Date(node.dateGroupModified ?? 0),
				};
			} else {
				bookmark = {
					immutable: node.unmodifiable !== undefined,
					id: node.id,
					title: node.title,
					added: new Date(node.dateAdded ?? 0),
					folder: false,
					url: node.url,
					last_used: new Date(node.dateLastUsed ?? 0),
				};
			}
			this.bookmarks[node.id] = bookmark;
			return bookmark;
		},
	},
});
