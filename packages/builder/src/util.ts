import { dirname } from "path";
import { mkdir, mkdirp, readFile, writeFile } from "fs-extra";
import { ClassType, transformAndValidate } from "class-transformer-validator";
import glob from "glob";
import YAML from "yaml";
import { ValidationError } from "class-validator";
const debug = require("debug-env")("compiler:builder:util");


/**
 * The data captured by a Glob pattern.
 */
export type UseCaptureGroupsInput<CaptureGroups extends string> = Partial<Record<number, string>> & Partial<Record<CaptureGroups, string>>;

/**
 * A callback that transforms the data captured by a Glob.
 */
export type UseCaptureGroups<CaptureGroups extends string, Out> = (i: UseCaptureGroupsInput<CaptureGroups>) => Out;

export interface FinalGlobResult {
  pattern: string;
  matches: string[];
}

export type NeedsCaptureGroupsGlobResult<CaptureGroups extends string> = UseCaptureGroups<CaptureGroups, FinalGlobResult>;

/**
 * Execute a Glob-powered file search.
 *
 * @param pattern The Glob pattern.
 */
export function g(pattern: string): FinalGlobResult
/**
 * Execute a Glob-powered file search, based on the results of a previous match.
 *
 * @param fn Template that computes a glob pattern.
 */
export function g<CaptureGroups extends string>(fn: UseCaptureGroups<CaptureGroups, string>): NeedsCaptureGroupsGlobResult<CaptureGroups>
export function g(
  i: string | UseCaptureGroups<string, string>
): FinalGlobResult | NeedsCaptureGroupsGlobResult<string> {
  if(typeof i === "string") {
    return {
      pattern: i,
      matches: glob.sync(i),
    };
  }
  const cb = i;
  return i => g(cb(i));
}

export interface ParsedYamlFile<FileDef extends object> {
  __type: "ParsedYamlFile";
  filename: string;
  data: Promise<FileDef>;
}

export interface AnnotatedYamlFile<CaptureGroups extends string, FileDef extends object> {
  __type: "AnnotatedYamlFile";
  pattern: string;
  groups?: Record<CaptureGroups, string>;
  matches?: RegExpExecArray;
  file: ParsedYamlFile<FileDef>;
}

export interface NeedsCaptureGroupsYamlFile<
  PriorCaptureGroups extends string,
  CaptureGroups extends string,
  FileDef extends object,
> {
  __type: "NeedsCaptureGroupsYamlFile";
  fn: UseCaptureGroups<PriorCaptureGroups, AnnotatedYamlFile<CaptureGroups, FileDef>[]>;
}

/**
 * Parse each YAML file found by a Glob pattern.
 * 
 * @param pattern A Glob result - parses each file found.
 * @param regex A regex to parse the filenames found - allows extracting parameters.
 * @param capture Any string-based regex captures.
 * @param cls The class that defines the structure of the input file.
 */
export function yaml<CaptureGroups extends string, FileDef extends object>(
  pattern: FinalGlobResult,
  regex: RegExp,
  capture: CaptureGroups[],
  cls: ClassType<FileDef>,
): AnnotatedYamlFile<CaptureGroups, FileDef>[]
/**
 * Read and parse a YAML file.
 * 
 * @param file The path to the file that should be read and parsed.
 * @param cls The class definition of the file structure.
 */
export function yaml<FileDef extends object>(
  file: string,
  cls: ClassType<FileDef>
): ParsedYamlFile<FileDef>
/**
 * Using a Glob pattern that depends on the parent match, parse each YAML file found by the generated Glob patterns.
 *
 * @param pattern the builder to create Glob patterns
 * @param regex A regex to parse filenames found - allows extracting parameters
 * @param capture Any string-based regex captures.
 * @param cls The class that defines the structure of the input file.
 */
export function yaml<PriorCaptureGroups extends string, CaptureGroups extends string, FileDef extends object>(
  pattern: NeedsCaptureGroupsGlobResult<PriorCaptureGroups>,
  regex: RegExp,
  capture: CaptureGroups[],
  cls: ClassType<FileDef>,
): NeedsCaptureGroupsYamlFile<PriorCaptureGroups, CaptureGroups, FileDef>
export function yaml<FileDef extends object>(
  i0: string | FinalGlobResult | NeedsCaptureGroupsGlobResult<string>,
  i1: RegExp | ClassType<FileDef>,
  i2?: string[],
  i3?: ClassType<FileDef>
): AnnotatedYamlFile<string, FileDef>[] | ParsedYamlFile<FileDef> | NeedsCaptureGroupsYamlFile<string, string, FileDef> {
  if(typeof i0 === "string" && !(i1 instanceof RegExp)) {
    const filename = i0;
    const cls = i1;
    const file = readFile(filename, "utf-8");
    const fileContents = file.then(f => YAML.parse(f, {
      schema: "yaml-1.1",
    }));
    const data = fileContents
      .then(i => transformAndValidate<FileDef>(cls, i, {
        validator: {
          forbidUnknownValues: true,
          forbidNonWhitelisted: true,
        },
      }))
      .then(i => {
        if(Array.isArray(i)) {
          throw new TypeError(`File ${filename} returned an array, and was supposed to return an object.`);
        }
        return i;
      });
    return {
      __type: "ParsedYamlFile",
      filename,
      data,
    };
  } else if(typeof i0 === "function" && i1 instanceof RegExp && i3) {
    const patternBuilder = i0;
    const regex = i1;
    const cap = i2 ?? [];
    const cls = i3;
    const out: NeedsCaptureGroupsYamlFile<string, string, FileDef> = {
      __type: "NeedsCaptureGroupsYamlFile",
      fn: i => {
        const built = patternBuilder(i);
        const v = yaml(built, regex, cap, cls);
        return v;
      },
    };
    return out;
  } else if(typeof i0 !== "string" && typeof i0 !== "function" && i1 instanceof RegExp && i3) {
    const pattern = i0;
    const regex = i1;
    const cls = i3;
    return pattern.matches.map(filename => {
      const file = readFile(filename, "utf-8");
      const data = file
        .then(i => YAML.parse(i, {
          schema: "yaml-1.1",
        }))
        .then(i => transformAndValidate<FileDef>(cls, i))
        .then(i => {
          if(Array.isArray(i)) {
            throw new TypeError(`File ${filename} returned an array, and was supposed to return an object.`);
          }
          return i;
        })
        .catch(e => {
          const validationErrors: ValidationError[] = Array.isArray(e) ? e.filter(i => i instanceof ValidationError) : [];
          if(validationErrors.length > 0) {
            console.error(`Encountered ${validationErrors.length} validation errors while parsing ${filename}`);
            validationErrors.forEach(err => {
              console.error(`Validation error on`, err.target);
              console.error(err.children);
              for (const child of err.children ?? []) {
                if(child.children) {
                  console.error(child.children);
                }
              }
            });
            throw e;
          }
          console.error(`Encountered error while reading or parsing a YAML file: ${filename}`, e);
          throw e;
        });
      const run = regex.exec(filename);
      const out: AnnotatedYamlFile<string, FileDef> = {
        __type: "AnnotatedYamlFile",
        pattern: pattern.pattern,
        groups: run?.groups ?? undefined,
        matches: run ?? undefined,
        file: {
          __type: "ParsedYamlFile",
          filename,
          data,
        },
      };
      return out;
    });
  }
  throw new Error("Unknown yaml argument format.");
}

export type Dependency<CaptureGroups extends string>
  = string
  | UseCaptureGroups<CaptureGroups, string | string[]>
  | NeedsCaptureGroupsYamlFile<CaptureGroups, string, object>
  | AnnotatedYamlFile<string, object>
  | ParsedYamlFile<object>;

export type DepResult<CaptureGroups extends string, Dep extends Dependency<CaptureGroups>> =
  Dep extends UseCaptureGroups<CaptureGroups, string | string[]>
    ? string | string[]
    : Dep extends NeedsCaptureGroupsYamlFile<CaptureGroups, infer SubCaptureGroup, infer SubFieldDef>
      ? AnnotatedYamlFile<SubCaptureGroup, SubFieldDef>[]
      : Dep extends AnnotatedYamlFile<infer SubCaptureGroup, infer SubFieldDef>
        ? AnnotatedYamlFile<SubCaptureGroup, SubFieldDef>
        : Dep extends ParsedYamlFile<infer SubFieldDef>
          ? ParsedYamlFile<SubFieldDef>
          : string;

function isUseCaptureGroups<CaptureGroups extends string>(
  dep: Dependency<CaptureGroups>,
): dep is UseCaptureGroups<CaptureGroups, string | string[]> {
  return typeof dep === "function";
}

function isNeedsCaptureGroupsYamlFile<CaptureGroups extends string>(
  dep: Dependency<CaptureGroups>,
): dep is NeedsCaptureGroupsYamlFile<CaptureGroups, string, object> {
  return typeof dep === "object" && dep.__type === "NeedsCaptureGroupsYamlFile";
}

function isAnnotatedYamlFile<CaptureGroups extends string>(
  dep: Dependency<CaptureGroups>,
): dep is AnnotatedYamlFile<string, object> {
  return typeof dep === "object" && dep.__type === "AnnotatedYamlFile";
}

function isParsedYamlFile<CaptureGroups extends string>(
  dep: Dependency<CaptureGroups>,
): dep is ParsedYamlFile<object> {
  return typeof dep === "object" && dep.__type === "ParsedYamlFile";
}

export interface FilesOutput {
  files: string[];
};

/**
 * Compile a set of files.
 *
 * @param jake The Jake environment.
 * @param files The input files to build
 * @param depObj Dependencies to find, given the output files.
 * @param cb Callback to run the command.
 */
export function files<
  CaptureGroups extends string,
  FieldDef extends object,
  DepObj extends { [key: string]: Dependency<CaptureGroups> },
  DepResultObj extends { [Property in keyof DepObj]: DepResult<CaptureGroups, DepObj[Property]> },
>(
  jake: any,
  files: AnnotatedYamlFile<CaptureGroups, FieldDef>[],
  outFile: UseCaptureGroups<CaptureGroups, string>,
  depObj: DepObj,
  cb: (
    out: string,
    file: AnnotatedYamlFile<CaptureGroups, FieldDef>,
    captured: Partial<Record<CaptureGroups, string>>,
    res: DepResultObj,
  ) => Promise<void>,
): FilesOutput {
  const res: FilesOutput = {
    files: [],
  };
  for(const file of files) {
    const groups: Record<CaptureGroups, string> | {} = file.groups !== undefined ? file.groups : {};
    const matches: Partial<Record<number, string>> = file.matches ?? {};
    const opts: Partial<Record<CaptureGroups, string>> & Partial<Record<number, string>> = {
      ...groups,
      ...matches,
    };
    const found: Partial<DepResultObj> = {};
    const inputFiles: string[] = [];
    for (const depName in depObj) {
      if (!Object.prototype.hasOwnProperty.call(depObj, depName)) {
        continue;
      }
      const deps = depObj[depName];
      if(typeof deps === "string") {
        const d: DepResult<CaptureGroups, string> = deps;
        inputFiles.push(d);
        found[depName] = d as any;
      } else if(isUseCaptureGroups(deps)) {
        const d: DepResult<CaptureGroups, UseCaptureGroups<CaptureGroups, string | string[]>>
          = deps(opts);
        if(typeof d === "string") {
          inputFiles.push(d);
        } else {
          for(const inputFile of d) {
            inputFiles.push(inputFile);
          }
        }
        found[depName] = d as any;
      } else if(isNeedsCaptureGroupsYamlFile(deps)) {
        const yamlFiles = deps.fn(opts);
        for (const file of yamlFiles) {
          inputFiles.push(file.file.filename);
        }
        found[depName] = yamlFiles as any;
      } else if(isAnnotatedYamlFile(deps)) {
        const yamlFile = deps;
        inputFiles.push(yamlFile.file.filename);
        found[depName] = yamlFile as any;
      } else if(isParsedYamlFile(deps)) {
        const yamlFile = deps;
        inputFiles.push(yamlFile.filename);
        found[depName] = yamlFile as any;
      }
    }
    const out = outFile(opts);
    res.files.push(out);
    debug.debug(`Creating rule to build ${out} from`, inputFiles);
    jake.desc(`Build ${out}`);
    jake.file(
      out,
      inputFiles,
      () => {
        debug.trace(`Compiling ${out}`);
        return cb(out, file, file.groups ?? {}, found as DepResultObj);
      }
    );
  }
  return res;
}

export async function outputFile(out: string, contents: string) {
  await mkdirp(dirname(out));
  await writeFile(out, contents);
}

export function reportValidationErrors(e: any) {
  const errors: ValidationError[] = (Array.isArray(e) ? e : [e]).filter(i => i instanceof ValidationError);
  if(errors.length > 0) {
    errors.forEach(error => {
      console.error(error);
      if(error.children) {
        reportValidationErrors(error.children);
      }
    });
    throw e;
  }
  throw e;
}

export async function outputJson<T extends object>(
  out: string,
  cls: ClassType<T>,
  object: Partial<T>,
): Promise<void> {
  try {
    const data = await transformAndValidate(cls, object, {
      validator: {
        forbidUnknownValues: true,
        forbidNonWhitelisted: true,
      }
    });
    await outputFile(out, JSON.stringify(data, null, 2));
  } catch (e) {
    reportValidationErrors(e);
  }
}
