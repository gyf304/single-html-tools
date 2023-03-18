import fs from "node:fs/promises";

import * as esbuild from "esbuild";

const mimeTypes = {
	"html": "text/html",
	"js": "text/javascript",
	"css": "text/css",
};

async function main() {
	const htmlTemplate = await fs.readFile("./static/index.html", "utf8");
	const result = await esbuild.build({
		entryPoints: ["src/index.tsx"],
		target: "es2015",
		format: "iife",
		outdir: "dist",
		bundle: true,
		minify: true,
		write: false,
	});
	let html = htmlTemplate;
	for (const file of result.outputFiles) {
		const name = "./" + file.path.split("/").pop();
		const ext = name.split(".").pop()!;
		const mimeType = mimeTypes[ext];
		html = html.replace(name, `data:${mimeType};base64,${btoa(file.text)}`);
	}
	await fs.mkdir("dist", { recursive: true });
	await fs.writeFile("dist/index.html", html);
}

(async () => {
	try {
		await main();
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
})();
