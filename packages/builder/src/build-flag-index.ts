import { CompiledFlagIndex, FlagDefinition, FlagFileDefinition } from "@idfyi/dto";
import { AsciidocEnvironment } from "./asciidoc-rendering";

export function buildFlagIndex(
  renderer: AsciidocEnvironment,
  identityId: string,
  flagId: string,
  info: FlagFileDefinition,
  flag: FlagDefinition,
): CompiledFlagIndex {
  if(!flag) {
    throw new ReferenceError(`build-flag-index: Cannot build flag ${flagId}: does not have a flag defined.`);
  }
  return {
    id: flagId,
    name: info.name,
    communityContributed: info["community contributed"],
    source: flag.source,
    author: flag.author,
    license: flag.license,
    basedOn: flag["based on"],
    aliasOf: info.alias ?? undefined,
    info: flag.info,
    rect: {
      svg: `/${identityId}/flags/${flagId}/${flagId}.svg`,
    },
    square: {
      svg: `/${identityId}/flags/${flagId}/${flagId}.square.svg`,
    },
  };
}
