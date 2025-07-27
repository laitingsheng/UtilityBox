import { fileURLToPath, URL } from "node:url";
import { readFile } from "node:fs/promises";

import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import lodash from "lodash";
import sharp from "sharp";
import { defineConfig } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";

import package_info from "./package.json";

// https://vite.dev/config/
export default defineConfig({
	build: {
		assetsInlineLimit: 0,
		rollupOptions: {
			input: {
				options: "./options.html",
				background: "./src/background.ts",
			},
			output: {
				assetFileNames: "[name].[hash].[ext]",
				chunkFileNames: "[name].[hash].js",
				entryFileNames: "[name].js",
			},
		},
	},
	plugins: [
		tailwindcss(),
		vue(),
		vueJsx(),
		{
			name: "generate-icons",
			async buildStart() {
				const favicon_buffer = await readFile("favicon.png");
				this.emitFile({
					type: "asset",
					fileName: "icon-16.png",
					source: await sharp(favicon_buffer).resize(16, 16).png({ compressionLevel: 9 }).toBuffer(),
				});
				this.emitFile({
					type: "asset",
					fileName: "icon-32.png",
					source: await sharp(favicon_buffer).resize(32, 32).png({ compressionLevel: 9 }).toBuffer(),
				});
				this.emitFile({
					type: "asset",
					fileName: "icon-48.png",
					source: await sharp(favicon_buffer).resize(48, 48).png({ compressionLevel: 9 }).toBuffer(),
				});
				this.emitFile({
					type: "asset",
					fileName: "icon-96.png",
					source: await sharp(favicon_buffer).resize(96, 96).png({ compressionLevel: 9 }).toBuffer(),
				});
				this.emitFile({
					type: "asset",
					fileName: "extension.png",
					source: await sharp(favicon_buffer)
						.resize(96, 96)
						.extend({
							top: 16,
							bottom: 16,
							left: 16,
							right: 16,
							background: { r: 0, g: 0, b: 0, alpha: 0 },
						})
						.png({ compressionLevel: 9 })
						.toBuffer(),
				});
			},
		},
		{
			name: "generate-manifest",
			generateBundle() {
				this.emitFile({
					type: "asset",
					fileName: "manifest.json",
					source: JSON.stringify({
						manifest_version: 3,
						name: lodash.startCase(package_info.name),
						version: package_info.version,
						incognito: "not_allowed",
						options_page: "options.html",
						permissions: ["bookmarks", "history", "storage"],
						minimum_chrome_version: "95",
						background: {
							service_worker: "background.js",
							type: "module",
						},
						icons: {
							16: "icon-16.png",
							32: "icon-32.png",
							48: "icon-48.png",
							96: "icon-96.png",
							128: "extension.png",
						},
					} as chrome.runtime.ManifestV3),
				});
			},
		},
		vueDevTools(),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
});
