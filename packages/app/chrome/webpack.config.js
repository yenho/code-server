const path = require("path");
const root = path.resolve(__dirname, "../../..");
const merge = require("webpack-merge");

module.exports = [
	merge(require(path.join(__dirname, "../../../scripts", "webpack.client.config.js"))({
		entry: path.join(root, "packages/app/chrome/src/background.ts"),
	}), {
		devtool: "none",
		mode: "development",
		target: "web",
		output: {
			path: path.join(__dirname, "out"),
			filename: "background.js",
		},
	}),
	merge(require(path.join(__dirname, "../../../scripts", "webpack.client.config.js"))({
		entry: path.join(root, "packages/app/chrome/src/main/content.ts"),
	}), {
		devtool: "none",
		mode: "development",
		target: "web",
		output: {
			path: path.join(__dirname, "out"),
			filename: "content.js",
		},
	}),
	merge(require(path.join(__dirname, "../../../scripts", "webpack.client.config.js"))({
		entry: path.join(root, "packages/app/chrome/src/ide/ide.ts"),
	}), {
		devtool: "none",
		mode: "development",
		target: "web",
		output: {
			path: path.join(__dirname, "out"),
			filename: "ide.js",
		},
	}),
];
