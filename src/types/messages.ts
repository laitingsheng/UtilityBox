export interface BookmarkCleaningRequest {
	type: "clean.bookmarks";
};

export interface HistoryCleaningRequest {
	type: "clean.history";
}

export type Message = BookmarkCleaningRequest | HistoryCleaningRequest;

export interface MessageResponse {
	status: "started" | "running";
}
