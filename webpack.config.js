const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const IgnoreEmitPlugin = require("ignore-emit-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const ZipPlugin = require("zip-webpack-plugin")
const { join } = require("path")

const babelTargets = "chrome 103"

/** @type {import("webpack").Configuration} */
const config = {
	mode: "production",
	devtool: "source-map",
	entry: {
		"contentScript": "./src/contentScript.ts",
		"background": "./src/background.ts",
		"popup/script": "./src/popup/script.ts",
		"popup/style": "./src/popup/style.scss"
	},
	output: {
		filename: "[name].js",
		path: join(__dirname, "build")
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "src/popup/index.html",
			filename: "popup/index.html",
			inject: false
		}),
		new CopyPlugin({
			patterns: ["src/manifest.json"]
		}),
		new MiniCssExtractPlugin({
			filename: "[name].css"
		}),
		new IgnoreEmitPlugin([
			"popup/style.js"
		]),
		new ZipPlugin({
			filename: "BlurBypasser.zip",
			path: __dirname
		})
	],
	module: {
		rules: [
			{
				test: /\.(s[ac]|c)ss$/i,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"postcss-loader",
					"sass-loader"
				]
			},
			{
				test: /\.js$/i,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							["@babel/preset-env", { targets: babelTargets }]
						]
					}
				}
			},
			{
				test: /\.ts$/i,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							["@babel/preset-env", { targets: babelTargets }],
							"@babel/preset-typescript"
						]
					}
				}
			}
		]
	},
	resolve: {
		extensions: [".ts", ".js"]
	}
}

module.exports = config
