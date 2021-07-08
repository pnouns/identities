import { CompiledIdentityList, FlagFileDefinition, IdentityFileDefinition } from "@idfyi/dto";
import { AsciidocEnvironment } from "./asciidoc-rendering";
import { buildBriefFlag } from "./build-brief-flag";
import { renderTextBlock } from "./render/text-block";

export interface IdentityAssets {
  id: string;
  identity: IdentityFileDefinition;
  flag?: FlagFileDefinition;
  flagId?: string;
}

export function buildIdentityList(
  renderer: AsciidocEnvironment,
  name: string,
  identities: IdentityAssets[],
): CompiledIdentityList {
  return {
    name,
    identities: identities.map(({ id, identity, flag, flagId }) => ({
      id,
      name: identity.name,
      summary: identity.summary ? renderTextBlock(renderer, identity.summary) : undefined,
      defaultFlag: !flag || !flagId ? undefined : buildBriefFlag(id, flagId, flag),
    })),
  };
}
