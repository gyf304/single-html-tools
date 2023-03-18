import * as esbuild from "esbuild";
import fetch, { Headers } from "node-fetch";
import fastify from "fastify";
import { spawn } from "node:child_process";
import http from 'node:http';

async function main() {
	const ctx = await esbuild.context({
		entryPoints: ["src/index.tsx"],
		outdir: "static",
		target: "es2015",
		format: "iife",
		bundle: true,
		minify: true,
		sourcemap: true,
		write: false,
	});
	const { host: esbuildHost, port: esbuildPort } = await ctx.serve({
		servedir: "static",
	});

	console.log(`Serving on http://${esbuildHost}:${esbuildPort}`);
}

(async () => {
	try {
		await main();
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
})();
