import path from "node:path";
import type { Compiler, Configuration, WebpackPluginInstance } from "webpack";
import { RawSource } from "webpack-sources";

import CopyPlugin from "copy-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import HtmlMinimizerPlugin from "html-minimizer-webpack-plugin";
import JsonMinimizerPlugin from "json-minimizer-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

import package_info from "./package.json";

class ExtensionManifestGeneratorPlugin implements WebpackPluginInstance {
	apply(compiler: Compiler): void {
		compiler.hooks.make.tapPromise(this.constructor.name, async (compilation) => {
			const manifest: chrome.runtime.ManifestV3 = {
				manifest_version: 3,
				name: package_info.name.split(/[-_]+/).map(
					word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
				).join(" "),
				version: package_info.version,
				incognito: "not_allowed",
				options_page: "options.html",
				permissions: [
					"bookmarks",
					"storage",
				],
			};
			compilation.assets["manifest.json"] = new RawSource(JSON.stringify(manifest));
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
		new ExtensionManifestGeneratorPlugin(),
		new CopyPlugin({
			patterns: [
				{ from: "public", to: "." },
			],
			options: {},
		}),
		new MiniCssExtractPlugin({
			filename: "[name].css",
		}),
	],
};

export default config;
