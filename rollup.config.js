const {esm, umds} = require("./config/bundler");

export default [
	...umds({
		input: "./src/index.umd.ts",
		outputs: [
			`./dist/isomterizer.js`,
			`./dist/isomterizer.min.js`,
		],
		library: "Isometrizer"
	}),
	...umds({
		input: "./src/index.umd.ts",
		outputs: [
			`./dist/isomterizer.pkgd.js`,
			`./dist/isomterizer.pkgd.min.js`,
		],
		library: "Isometrizer",
	}),
	esm({
		input: "./src/index.ts",
		output: "./dist/isomterizer.esm.js"
	}),
];

