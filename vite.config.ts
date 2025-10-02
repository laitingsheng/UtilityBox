import { readFile } from "node:fs/promises";
import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { startCase } from "es-toolkit/string";
import sharp from "sharp";
import { defineConfig } from "vite";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import vueDevTools from "vite-plugin-vue-devtools";

import package_info from "./package.json";

// https://vite.dev/config/
export default defineConfig({
	build: {
		assetsInlineLimit: 0,
		rollupOptions: {
			input: {
				options: "./options.html",
				popup: "./popup.html",
				background: "./src/background.ts",
			},
			output: {
				assetFileNames: "assets/[name].[hash].[ext]",
				chunkFileNames: "chunks/[name].[hash].js",
				entryFileNames: "[name].js",
			},
		},
	},
	plugins: [
		tailwindcss(),
		vue(),
		vueJsx(),
		ViteEjsPlugin({
			title: startCase(package_info.name),
		}),
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
					fileName: "icons/16x16.png",
				});
				this.emitFile({
					type: "asset",
					source: await base_sharp.clone().resize(32, 32).toBuffer(),
					fileName: "icons/32x32.png",
				});

				this.emitFile({
					type: "asset",
					source: await base_sharp.clone().resize(48, 48).toBuffer(),
					fileName: "icons/48x48.png",
				});
				this.emitFile({
					type: "asset",
					source: await base_sharp.clone().resize(96, 96).toBuffer(),
					fileName: "icons/96x96.png",
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
					fileName: "icons/webstore.png",
				});
				this.emitFile({
					type: "asset",
					source: await base_sharp.clone().toBuffer(),
					fileName: "icons/fallback.png",
				});
				const messages: Record<string, { message: string }> = {
					name: {
						message: startCase(package_info.name),
					},
					description: {
						message: package_info.description,
					},
					duplicate_hostname: {
						message: "Duplicate hostname in rules is not allowed.",
					},
				};
				for (const key of [
					"bookmarks",
					"clean_bookmarks",
					"clean_history",
					"cleaning_rules",
					"editing",
					"history",
					"hostname",
					"options",
					"save",
					"subdomains",
				]) {
					messages[key] = {
						message: startCase(key),
					};
				}
				this.emitFile({
					type: "asset",
					source: JSON.stringify(messages),
					fileName: "_locales/en/messages.json",
				});
				this.emitFile({
					type: "asset",
					source: JSON.stringify({
						manifest_version: 3,
						current_locale: "en",
						default_locale: "en",
						name: "__MSG_name__",
						description: "__MSG_description__",
						version: package_info.version,
						icons: {
							16: "icons/16x16.png",
							32: "icons/32x32.png",
							48: "icons/48x48.png",
							96: "icons/96x96.png",
							128: "icons/webstore.png",
						},
						action: {
							default_popup: "popup.html",
							default_title: startCase(package_info.name),
							default_icon: "icons/fallback.png",
						},
						background: {
							service_worker: "background.js",
							type: "module",
						},
						incognito: "not_allowed",
						options_page: "options.html",
						permissions: ["bookmarks", "history", "storage"],
						minimum_chrome_version: "99",
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
