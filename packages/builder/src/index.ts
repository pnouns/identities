export function asciidocRender() {
  const { asciidocRender } = require("./asciidoc-rendering");
  return asciidocRender;
}

export function buildFlagIndex() {
  const { buildFlagIndex } = require("./build-flag-index");
  return buildFlagIndex;
}

export function buildIdentityIndex() {
  const { buildIdentityIndex } = require("./build-identity-index");
  return buildIdentityIndex;
}

export function buildIdentityList() {
  return require("./build-identity-list").buildIdentityList;
}

export function buildSquareSVGFlag() {
  return require("./build-flag-svg").buildSquareSVGFlag;
}

export function buildRectangleSVGFlag() {
  return require("./build-flag-svg").buildRectangleSVGFlag;
}

export {
  g,
  yaml,
  files,
  outputJson,
} from "./util";
