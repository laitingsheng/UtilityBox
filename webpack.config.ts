import { glob } from "glob";
import { startCase } from "lodash";
import fs from "node:fs/promises";
import path from "node:path";
import type { Compiler, Configuration, WebpackPluginInstance } from "webpack";
import { OriginalSource, RawSource } from "webpack-sources";

import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import HtmlMinimizerPlugin from "html-minimizer-webpack-plugin";
import JsonMinimizerPlugin from "json-minimizer-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

import package_info from "./package.json";

class ChromeExtensionPlugin implements WebpackPluginInstance {
	private permissions: chrome.runtime.ManifestPermissions[];

	constructor(permissions: chrome.runtime.ManifestPermissions[]) {
		this.permissions = permissions;
	}

	apply(compiler: Compiler): void {
		compiler.hooks.make.tapPromise(this.constructor.name, async (compilation) => {
			const manifest: chrome.runtime.ManifestV3 = {
				manifest_version: 3,
				name: startCase(package_info.name),
				version: package_info.version,
				incognito: "not_allowed",
				options_page: "options.html",
				permissions: this.permissions,
			};
			compilation.assets["manifest.json"] = new RawSource(JSON.stringify(manifest));

			for (const file of await glob("public/*.html")) {
				compilation.assets[path.basename(file)] = new OriginalSource(await fs.readFile(file, {
					encoding: "utf8",
					flag: "r",
				}), file);
			}
		});
	}
}

const config: Configuration = {
	entry: Object.fromEntries(
		[
			"options",
			"popup",
		].map(name => [name, path.resolve(__dirname, "src", `${name}.tsx`)])
	),
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].js",
	},
	optimization: {
		minimize: true,
		minimizer: [
			"...",
			new CssMinimizerPlugin(),
			new HtmlMinimizerPlugin(),
			new JsonMinimizerPlugin(),
		],
		splitChunks: {
			name: "vendor",
			chunks: "all",
			cacheGroups: {
				styles: {
					type: "css/mini-extract",
					enforce: true,
				},
			},
		}
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
			},
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".ts", ".tsx", ".css", ".js"],
	},
	plugins: [
		new ChromeExtensionPlugin([
			"bookmarks",
			"storage",
		]),
		new MiniCssExtractPlugin({
			filename: "[name].css",
		}),
	],
};

export default config;
