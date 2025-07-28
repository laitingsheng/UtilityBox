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
