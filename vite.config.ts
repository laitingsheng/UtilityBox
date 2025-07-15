import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import lodash from "lodash";
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';

import package_info from './package.json';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		{
			name: "generate-manifest",
			generateBundle() {
				const manifest: chrome.runtime.ManifestV3 = {
					manifest_version: 3,
					name: lodash.startCase(package_info.name),
					version: package_info.version,
					incognito: "not_allowed",
					options_page: "index.html",
					permissions: [
						"bookmarks",
						"storage",
					],
				};
				this.emitFile({
					type: 'asset',
					fileName: 'manifest.json',
					source: JSON.stringify(manifest),
				});
			},
		},
		devtoolsJson(),
	],
});
