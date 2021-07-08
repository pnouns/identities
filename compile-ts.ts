import { basename, dirname, join } from "path";
import { exec } from "child-process-promise";
import { copyFile, mkdirp, remove } from "fs-extra";
const debug = require("debug-env")("compiler:compile-ts");

export async function runCompilation(
  cwd: string,
  input: string,
  output: string,
  options?: string[],
) {
  const fullOut = join(cwd, output);
  const optsArray = options ?? [
    "--esModuleInterop",
    "--target", "es6",
    "--lib", "es2016",
    "--module", "commonjs",
    "--experimentalDecorators",
    "--emitDecoratorMetadata",
    "--declaration",
    "--strict",
    "--strictPropertyInitialization", "false",
    "--noImplicitAny", "false",
  ];
  const tmpDir = join(cwd, ".tmp");
  const tmpOut = join(tmpDir, output);
  const localTmpDir = join(".tmp", "out");
  await remove(tmpDir);
  await mkdirp(dirname(tmpOut));
  const fn = `yarn tsc ${optsArray.join(" ")} --outDir ${localTmpDir} ${input} ${cwd.includes("builder") ? "src/placeholder.ts" : ""}`;
  debug.debug(fn);
  await exec(fn, {
    cwd,
  });
  await mkdirp(dirname(fullOut));
  debug.trace(`Copying ${tmpOut} to ${fullOut}`);
  await copyFile(tmpOut, fullOut);
  const tempDefOut = join(tmpDir, dirname(output), `${basename(output, ".js")}.d.ts`);
  const defOut = join(cwd, dirname(output), `${basename(fullOut, ".js")}.d.ts`);
  debug.trace(`Copying ${tempDefOut} to ${defOut}`);
  await copyFile(tempDefOut, defOut);
}

export function compileTypescript(
  jake: any,
  input: string,
  output: string,
  cwd?: string,
  options?: string[],
  deps: string[] = [],
): string {
  const _cwd = cwd ?? ".";
  const fullSrc = join(_cwd, input);
  const fullOut = join(_cwd, output);
  debug.debug(`Creating rule to build ${fullOut} from ${fullSrc}, compiling via TypeScript.`);
  jake.desc(`Compile via TypeScript: ${fullSrc}`);
  jake.file(fullOut, [fullSrc, ...deps], async () => {
    await runCompilation(_cwd, input, output, options);
  });
  return fullOut;
}

/**
 * Compile a source file from the builder package.
 * 
 * @param input The filename to build - start at cwd, omit the extension.
 * 
 * @example compileBuilderTypescript("index")
 */
export function compileBuilderTypescript(
  jake: any,
  input: string,
  deps?: string[],
): string {
  return compileTypescript(
    jake,
    `src/${input}.ts`,
    `out/${input}.js`,
    "packages/builder",
    undefined,
    deps,
  );
}
