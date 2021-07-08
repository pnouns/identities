/**
 * Build things that are required before running Jake.
 */

import { runCompilation } from "./compile-ts";

async function runBuilder(input: string, out = input) {
  console.log(`Build '${input}'.`);
  await runCompilation("packages/builder", `src/${input}.ts`, `out/${out}.js`);
}

async function prebuild() {
  await runBuilder("util");
  //await runBuilder("asciidoc-rendering");
  //await runBuilder("build-identity-index");
  await runBuilder("index");
}

prebuild();
