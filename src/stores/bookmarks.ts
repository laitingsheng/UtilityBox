import { defineStore } from "pinia";

interface BookmarkBase {
	readonly immutable: boolean;
	readonly id: string;
	title: string;
	readonly added?: Date;
}

export interface BookmarkFolder extends BookmarkBase {
	folder: true;
	children: Array<string>;
	last_modified?: Date;
}

export interface BookmarkItem extends BookmarkBase {
	folder: false;
	url: string;
	last_used?: Date;
}

export type Bookmark = BookmarkItem | BookmarkFolder;

export const use_bookmarks_store = defineStore("bookmarks", {
	state: () => ({
		parent: undefined as string | undefined,
		others: undefined as string | undefined,
		selected: undefined as string | undefined,
		bookmarks: {} as Record<string, Bookmark | undefined>,
	}),

	actions: {
		traverse(node: chrome.bookmarks.BookmarkTreeNode): void {
			if (this.bookmarks[node.id] !== undefined) {
				return;
			}
			const immutable = node.unmodifiable !== undefined;
			const added = node.dateAdded === undefined ? undefined : new Date(node.dateAdded);
			if (node.url === undefined) {
				const children: string[] = [];
				const last_modified = node.dateGroupModified === undefined ? undefined : new Date(node.dateGroupModified);
				this.bookmarks[node.id] = {
					immutable,
					id: node.id,
					title: node.title,
					added,
					folder: true,
					children,
					last_modified,
				};
				for (const child of node.children ?? []) {
					children.push(child.id);
					this.traverse(child);
				}
			} else {
				const last_used = node.dateLastUsed === undefined ? undefined : new Date(node.dateLastUsed);
				this.bookmarks[node.id] = {
					immutable,
					id: node.id,
					title: node.title,
					added,
					folder: false,
					url: node.url,
					last_used,
				};
			}
		},
	},
});
