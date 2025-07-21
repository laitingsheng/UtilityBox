import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import lodash from "lodash";
import { defineConfig } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";

import package_info from "./package.json";

// https://vite.dev/config/
export default defineConfig({
	build: {
		assetsInlineLimit: 0,
	},
	plugins: [
		tailwindcss(),
		vue(),
		vueJsx(),
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
						options_page: "index.html",
						permissions: ["bookmarks", "history", "storage"],
						minimum_chrome_version: "95",
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
