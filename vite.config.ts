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
				const base_sharp = sharp(await readFile("favicon.png")).png({
					compressionLevel: 9,
					adaptiveFiltering: true,
				});
				this.emitFile({
					type: "asset",
					source: await base_sharp.clone().resize(16, 16).toBuffer(),
					fileName: "icon-16.png",
				});
				this.emitFile({
					type: "asset",
					source: await base_sharp.clone().resize(32, 32).toBuffer(),
					fileName: "icon-32.png",
				});

				this.emitFile({
					type: "asset",
					source: await base_sharp.clone().resize(48, 48).toBuffer(),
					fileName: "icon-48.png",
				});
				this.emitFile({
					type: "asset",
					source: await base_sharp.clone().resize(96, 96).toBuffer(),
					fileName: "icon-96.png",
				});
				this.emitFile({
					type: "asset",
					source: await base_sharp
						.clone()
						.resize(96, 96)
						.extend({
							top: 16,
							bottom: 16,
							left: 16,
							right: 16,
							background: { r: 0, g: 0, b: 0, alpha: 0 },
						})
						.toBuffer(),
					fileName: "webstore.png",
				});
				this.emitFile({
					type: "asset",
					source: await base_sharp.clone().toBuffer(),
					fileName: "icon.png",
				});
				this.emitFile({
					type: "asset",
					source: JSON.stringify({
						manifest_version: 3,
						name: lodash.startCase(package_info.name),
						description: "Advanced bookmark management with automated organisation, cleaning, and URL rewriting capabilities for Chromium-based browsers.",
						version: package_info.version,
						icons: {
							16: "icon-16.png",
							32: "icon-32.png",
							48: "icon-48.png",
							96: "icon-96.png",
							128: "webstore.png",
						},
						background: {
							service_worker: "background.js",
							type: "module",
						},
						incognito: "not_allowed",
						options_page: "options.html",
						permissions: ["bookmarks", "history", "storage"],
						minimum_chrome_version: "95",
					} as chrome.runtime.ManifestV3),
					fileName: "manifest.json",
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
