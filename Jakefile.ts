import "reflect-metadata";
import path from "path";
import {
  files,
  yaml,
  g,
  outputFile,
  outputJson,
  UseCaptureGroupsInput,
  AnnotatedYamlFile,
} from "./packages/builder/out/util";
import {
  CompiledFlagIndex,
  CompiledIdentityIndexFile,
  CompiledIdentityList,
  FlagFileDefinition,
  IdentityFileDefinition,
} from "@idfyi/dto";
import {
  compileBuilderTypescript,
} from "./compile-ts";
import { copy, mkdirp, readFileSync, remove, symlink, writeFile } from "fs-extra";
import YAML from "yaml";
import { transformAndValidateSync } from "class-transformer-validator";
import fetch from "node-fetch";
const jake = require("jake");
const debug = require("debug-env")("compiler:jakefile");

const asciidocRendering = compileBuilderTypescript(jake, "asciidoc-rendering");
const renderRemix = compileBuilderTypescript(jake, "render/remix");
const renderTextBlock = compileBuilderTypescript(jake, "render/text-block", [
  asciidocRendering,
  renderRemix,
]);
const buildBriefFlag = compileBuilderTypescript(jake, "build-brief-flag");
const buildIdentityIndexScript = compileBuilderTypescript(jake, "build-identity-index", [
  asciidocRendering,
  renderTextBlock,
  buildBriefFlag,
]);
const buildIdentityListScript = compileBuilderTypescript(jake, "build-identity-list", [
  asciidocRendering,
  renderTextBlock,
  buildBriefFlag,
]);
const buildFlagIndexScript = compileBuilderTypescript(jake, "build-flag-index");
const buildFlagSvgScript = compileBuilderTypescript(jake, "build-flag-svg");

function renderer() {
  const { asciidocRender } = require("@idfyi/builder");
  return asciidocRender()({
    baseUrl: process.env.BASE_URL ?? undefined,
  });
}

const identityIndexFiles = files(
  jake,
  yaml(g("content/identities/*/index.yaml"), /^content\/identities\/(?<identity>.*)\/index\.yaml$/, [ "identity" ], IdentityFileDefinition),
  i => `dist/${i.identity}/index.json`,
  {
    file: i => `${i[0]}`,
    template: buildIdentityIndexScript,
    flags: yaml(
      g(i => `content/identities/${i.identity}/*.flag.yaml`),
      /^content\/identities\/(?<identity>.*)\/(?<flag>.*)\.flag\.yaml$/,
      [ "identity", "flag" ],
      FlagFileDefinition,
    ),
  },
  async (out, file, { identity }, { flags }) => {
    const { buildIdentityIndex } = require("@idfyi/builder");
    const data = await file.file.data;
    if(!identity) {
      throw new ReferenceError(`Couldn't find 'identity' for ${out}`);
    }
    await outputJson(out, CompiledIdentityIndexFile, await buildIdentityIndex()(renderer(), identity, data, flags));
  },
);
debug.debug(`Identity index: `, identityIndexFiles.files);

const flagDefs = yaml(g("content/identities/*/*.flag.yaml"), /^content\/identities\/(?<identity>.*)\/(?<flag>.*)\.flag\.yaml$/, [ "identity", "flag" ], FlagFileDefinition);

const getFlagAlias = (i: UseCaptureGroupsInput<"identity" | "flag">): AnnotatedYamlFile<string, FlagFileDefinition>[] => {
  const flagFile = `content/identities/${i.identity}/${i.flag}.flag.yaml`;
  const flagDef = readFileSync(flagFile, "utf-8");
  const flagContents = YAML.parse(flagDef, {
    schema: "yaml-1.1",
  });
  const data = transformAndValidateSync(FlagFileDefinition, flagContents);
  if(Array.isArray(data)) {
    throw new TypeError(`${flagFile} should be an object, not array`);
  }
  if(data.alias) {
    return yaml(g(`content/identities/${data.alias}.flag.yaml`), /.*/, [ "test" ], FlagFileDefinition);
  }
  return [];
  //return yaml(g(`content/identities/${i.identity}/${i.flag}.flag.yaml`), /.*/, [ "test" ], FlagFileDefinition);
};

const squareFlagFiles = files(
  jake,
  flagDefs,
  i => `dist/${i.identity}/flags/${i.flag}/${i.flag}.square.svg`,
  {
    file: i => `${i[0]}`,
    script: buildFlagSvgScript,
    alias: {
      __type: "NeedsCaptureGroupsYamlFile",
      fn: getFlagAlias,
    },
  },
  async (out, file, { identity, flag }, { alias }) => {
    const { buildSquareSVGFlag } = require("@idfyi/builder");
    const data = await file.file.data;
    if(alias.length > 0) {
      const origin = await alias[0].file.data;
      await outputFile(out, buildSquareSVGFlag()(origin.flag));
      return;
    }
    await outputFile(out, buildSquareSVGFlag()(data.flag));
  },
);

const rectangleFlagFiles = files(
  jake,
  flagDefs,
  i => `dist/${i.identity}/flags/${i.flag}/${i.flag}.svg`,
  {
    file: i => `${i[0]}`,
    script: buildFlagSvgScript,
    alias: {
      __type: "NeedsCaptureGroupsYamlFile",
      fn: getFlagAlias,
    },
  },
  async (out, file, { identity, flag }, { alias }) => {
    const { buildRectangleSVGFlag } = require("@idfyi/builder");
    const data = await file.file.data;
    if(alias.length > 0) {
      const origin = await alias[0].file.data;
      await outputFile(out, buildRectangleSVGFlag()(origin.flag));
      return;
    }
    await outputFile(out, buildRectangleSVGFlag()(data.flag));
  },
);

const flagIndexFiles = files(
  jake,
  flagDefs,
  i => `dist/${i.identity}/flags/${i.flag}/index.json`,
  {
    file: i => `${i[0]}`,
    script: buildFlagIndexScript,
    alias: {
      __type: "NeedsCaptureGroupsYamlFile",
      fn: getFlagAlias,
    },
  },
  async (out, file, { identity, flag }, { alias }) => {
    const { buildFlagIndex } = require("@idfyi/builder");
    const data = await file.file.data;
    const aliasFlag = alias.length > 0 ? (await alias[0].file.data).flag : data.flag;
    await outputJson(out, CompiledFlagIndex, buildFlagIndex()(renderer(), identity, flag, data, aliasFlag));
  },
);
debug.debug(`Flags: `, flagIndexFiles.files);

const homepageIndexFile = files(
  jake,
  yaml(g("content/identities/lesbian/index.yaml"), /.*/, ["identity"], IdentityFileDefinition),
  i => "dist/homepage.identities.json",
  {
    template: buildIdentityListScript,
    lesbian: yaml("content/identities/lesbian/index.yaml", IdentityFileDefinition),
    lesbianFlag: yaml("content/identities/lesbian/lesbian.flag.yaml", FlagFileDefinition),
    gay: yaml("content/identities/gay/index.yaml", IdentityFileDefinition),
    gayRainbowFlag: yaml("content/identities/gay/rainbow.flag.yaml", FlagFileDefinition),
    queer: yaml("content/identities/queer/index.yaml", IdentityFileDefinition),
    queerRainbowFlag: yaml("content/identities/queer/rainbow.flag.yaml", FlagFileDefinition),
    bi: yaml("content/identities/bi/index.yaml", IdentityFileDefinition),
    biFlag: yaml("content/identities/bi/bi.flag.yaml", FlagFileDefinition),
    trans: yaml("content/identities/trans/index.yaml", IdentityFileDefinition),
    transFlag: yaml("content/identities/trans/trans.flag.yaml", FlagFileDefinition),
    questioning: yaml("content/identities/questioning/index.yaml", IdentityFileDefinition),
    intersex: yaml("content/identities/intersex/index.yaml", IdentityFileDefinition),
    ace: yaml("content/identities/asexual/index.yaml", IdentityFileDefinition),
    aceFlag: yaml("content/identities/asexual/ace.flag.yaml", FlagFileDefinition),
    aceSpec: yaml("content/identities/ace-spec/index.yaml", IdentityFileDefinition),
    aceSpecFlag: yaml("content/identities/ace-spec/ace-spec.flag.yaml", FlagFileDefinition),
    aro: yaml("content/identities/aromantic/index.yaml", IdentityFileDefinition),
    aroFlag: yaml("content/identities/aromantic/aro.flag.yaml", FlagFileDefinition),
    aroSpec: yaml("content/identities/aro-spec/index.yaml", IdentityFileDefinition),
    aroSpecFlag: yaml("content/identities/aro-spec/aro-spec.flag.yaml", FlagFileDefinition),
    agender: yaml("content/identities/agender/index.yaml", IdentityFileDefinition),
    agenderFlag: yaml("content/identities/agender/agender.flag.yaml", FlagFileDefinition),
  },
  async (out, file, opts, {
    lesbian, lesbianFlag,
    gay, gayRainbowFlag,
    queer, queerRainbowFlag,
    bi, biFlag,
    trans, transFlag,
    questioning,
    intersex,
    ace, aceFlag,
    aceSpec, aceSpecFlag,
    aro, aroFlag,
    aroSpec, aroSpecFlag,
    agender, agenderFlag,
  }) => {
    const { buildIdentityList } = require("@idfyi/builder");
    await outputJson(out, CompiledIdentityList, buildIdentityList()(renderer(), "homepage", [
      { id: "lesbian", flagId: "lesbian", identity: await lesbian.data, flag: await lesbianFlag.data },
      { id: "gay", flagId: "rainbow", identity: await gay.data, flag: await gayRainbowFlag.data },
      { id: "bi", flagId: "bi", identity: await bi.data, flag: await biFlag.data },
      { id: "trans", flagId: "trans", identity: await trans.data, flag: await transFlag.data },
      { id: "queer", flagId: "rainbow", identity: await queer.data, flag: await queerRainbowFlag.data },
      { id: "questioning", identity: await questioning.data },
      { id: "intersex", identity: await intersex.data },
      { id: "asexual", flagId: "ace", identity: await ace.data, flag: await aceFlag.data },
      { id: "ace-spec", flagId: "ace-spec", identity: await aceSpec.data, flag: await aceSpecFlag.data },
      { id: "aromantic", flagId: "aro", identity: await aro.data, flag: await aroFlag.data },
      { id: "aro-spec", flagId: "aro-spec", identity: await aroSpec.data, flag: await aroSpecFlag.data },
      { id: "agender", flagId: "agender", identity: await agender.data, flag: await agenderFlag.data },
    ]));
  },
);

const allHomepages = files(
  jake,
  yaml(g("content/identities/queer/index.yaml"), /.*/, [ "i" ], IdentityFileDefinition),
  i => "dist/all.identities.json",
  {
    template: buildIdentityListScript,
    identities: yaml(g(i => "content/identities/*/index.yaml"), /^content\/identities\/(?<identity>.*)\/index\.yaml$/, [ "identity" ], IdentityFileDefinition),
    flags: yaml(
      g(i => `content/identities/*/*.flag.yaml`),
      /^content\/identities\/(?<identity>.*)\/(?<flag>.*)\.flag\.yaml$/,
      [ "identity", "flag" ],
      FlagFileDefinition,
    ),
  },
  async (out, file, opts, { identities: _identities, flags: _flags }) => {
    const { buildIdentityList } = require("@idfyi/builder");
    interface IdentityAssets {
      id: string;
      identity: IdentityFileDefinition;
      flag?: FlagFileDefinition;
      flagId?: string;
    }
    function isIdentityAssets(i: false | IdentityAssets): i is IdentityAssets {
      return i !== false;
    }
    const identities = await Promise.all(_identities.map(i => i.file.data.then(d => ({ identity: i, data: d }))));
    const flags = (await Promise.all(_flags.map(f => f.file.data.then(d => ({ flag: f, data: d })))))
      .filter(({ flag, data }) => data["default"] === true);
    const ids = identities
      .map<false | IdentityAssets>(identity => {
        if(!identity.identity.groups) {
          return false;
        }
        const id = identity.identity.groups.identity;
        const flag = flags.find(f => f.flag.groups && f.flag.groups.identity === id);
        return {
          id,
          identity: identity.data,
          flagId: flag && flag.flag.groups ? flag.flag.groups.flag : undefined,
          flag: flag ? flag.data : undefined,
        };
      })
      .filter<IdentityAssets>(isIdentityAssets);
    await outputJson(out, CompiledIdentityList, buildIdentityList()(renderer(), "all", ids));
  },
);

jake.file("dist/dist/", [], async () => {
  await mkdirp("dist/");
  await symlink(path.resolve("website/dist/"), path.resolve("dist/dist/"));
});

const INDEX_FILE = process.env.NODE_ENV === "production" ? "website/index.prod.html" : "website/index.html";
jake.file("dist/index.html", [ INDEX_FILE ], async () => {
  await mkdirp("dist/");
  await copy(INDEX_FILE, "dist/index.html");
});

const NOTO_SANS = "website/src/lib/noto-sans.scss";
jake.file(NOTO_SANS, [], async () => {
  const downloaded = await fetch("https://fonts.googleapis.com/css?family=Noto+Sans");
  const css = await downloaded.text();
  writeFile(NOTO_SANS, css);
});

const ADOC_CSS = "website/src/lib/asciidoctor-default.scss";
jake.file(ADOC_CSS, [], async () => {
  const downloaded = await fetch("https://cdn.jsdelivr.net/gh/asciidoctor/asciidoctor@2.0/data/stylesheets/asciidoctor-default.css");
  const css = await downloaded.text();
  writeFile(ADOC_CSS, css);
});

jake.file("dist/api.yaml", [ "docs/api.yaml" ], async () => {
  await mkdirp("dist/");
  await copy("docs/api.yaml", "dist/api.yaml");
});

jake.desc("Default");
jake.task("default", [
  ...identityIndexFiles.files,
  ...squareFlagFiles.files,
  ...rectangleFlagFiles.files,
  ...flagIndexFiles.files,
  ...homepageIndexFile.files,
  ...allHomepages.files,
  NOTO_SANS,
  ADOC_CSS,
  "dist/index.html",
  "dist/dist/",
  "dist/api.yaml",
], () => {});

jake.namespace("clean", () => {

  task("builder", [], async () => {
    await remove("packages/builder/.tmp/");
    await remove("packages/builder/out/");
  });

  task("dto", [], async () => {
    await remove("dto/.tmp/");
    await remove("dto/out/");
  });

  task("dist", [], async () => {
    await remove("dist/");
  });

  task("all", [
    "clean:builder",
    "clean:dto",
    "clean:dist",
  ]);
});
