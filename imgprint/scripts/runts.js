const esbuild = require("esbuild");
const result = esbuild.buildSync({
	entryPoints: [process.argv[2]],
	bundle: true,
	format: "cjs",
	target: "node12",
	bundle: true,
	write: false,
	external: ["esbuild", "node:*"],
	platform: "node",
});
const js = result.outputFiles[0].text;
(() => {
	eval(js);
})();
