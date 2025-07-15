export function create_root_element(): HTMLDivElement {
	const e = document.createElement("div");
	e.id = "react";
	e.className = "bg-100 scroll-smooth font-sans antialiased md:subpixel-antialiased";
	return e;
}
