import { FlagFileDefinition } from "@idfyi/dto";
import { CompiledBriefFlag } from "@idfyi/dto/out/compiled-util/CompiledBriefFlag";

export function buildBriefFlag(
  identityId: string,
  flagId: string,
  flag: FlagFileDefinition,
): CompiledBriefFlag | undefined {
  if(!flag) {
    return undefined;
  }
  return {
    id: flagId,
    name: flag.name,
    alias: flag.alias,
    rect: {
      svg: `/${identityId}/flags/${flagId}/${flagId}.svg`,
    },
    square: {
      svg: `/${identityId}/flags/${flagId}/${flagId}.square.svg`,
    },
  }
}
