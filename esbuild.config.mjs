import console from 'console';
import fs from 'fs';
import builtins from 'builtin-modules';
import esbuild from 'esbuild';
import process from 'process';


// Ensure build directory exists
if (!fs.existsSync("build")) {
  fs.mkdirSync("build");
}

// Check and copy files
if (fs.existsSync("manifest.json")) {
  fs.copyFile("manifest.json", "build/manifest.json", (err) => {
    if (err) console.log("Error copying manifest.json:", err);
  });
} else {
  console.log("manifest.json does not exist");
}

if (fs.existsSync("styles.css")) {
  fs.copyFile("styles.css", "build/styles.css", (err) => {
    if (err) console.log("Error copying styles.css:", err);
  });
} else {
  console.log("styles.css does not exist");
}


const prod = process.argv[2] === 'production';

const context = await esbuild.context({
  entryPoints: ['src/main.ts'],
  bundle: true,
  minify: prod,
  external: [
    'obsidian',
    'electron',
    '@codemirror/autocomplete',
    '@codemirror/collab',
    '@codemirror/commands',
    '@codemirror/language',
    '@codemirror/lint',
    '@codemirror/search',
    '@codemirror/state',
    '@codemirror/view',
    '@lezer/common',
    '@lezer/highlight',
    '@lezer/lr',
    ...builtins,
  ],
  format: 'cjs',
  target: 'es2018',
  logLevel: 'info',
  loader: { '.ts': 'ts', '.tsx': 'tsx' },
  jsxFactory: 'h',
  jsxFragment: 'Fragment',
  sourcemap: prod ? false : 'inline',
  treeShaking: true,
  outfile: 'build/main.js',
});


if (prod) {
	await context.rebuild();
	process.exit(0);
} else {
	await context.watch();
}
