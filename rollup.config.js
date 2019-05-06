const {esm, umds} = require("./config/bundler");

export default [
	...umds({
		input: "./src/index.umd.ts",
		outputs: [
			`./dist/isometrizer.js`,
			`./dist/isometrizer.min.js`,
		],
		library: "Isometrizer"
	}),
	...umds({
		input: "./src/index.umd.ts",
		outputs: [
			`./dist/isometrizer.pkgd.js`,
			`./dist/isometrizer.pkgd.min.js`,
		],
		library: "Isometrizer",
	}),
	esm({
		input: "./src/index.ts",
		output: "./dist/isometrizer.esm.js"
	}),
];

