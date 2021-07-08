import { CompiledIdentityIndexFile, FlagFileDefinition, IdentityFileDefinition } from "@idfyi/dto";
import { AsciidocEnvironment } from "./asciidoc-rendering";
import { renderTextBlock } from "./render/text-block";
import { AnnotatedYamlFile } from "./util";
import { buildBriefFlag } from "./build-brief-flag";

export async function buildIdentityIndex(
  renderer: AsciidocEnvironment,
  identityId: string,
  input: IdentityFileDefinition,
  flags: AnnotatedYamlFile<"identity" | "flag", FlagFileDefinition>[],
): Promise<CompiledIdentityIndexFile> {
  const defaultFlagArray = await Promise.all(flags.map(async flag => {
    const flagDef = await flag.file.data;
    if(flagDef.default) {
      return flag;
    }
    return false;
  }));
  const defaultFlag = defaultFlagArray.find((i): i is AnnotatedYamlFile<string, FlagFileDefinition> => i !== false);
  return {
    id: identityId,
    name: input.name,
    description: renderTextBlock(renderer, input.description),
    defaultFlag: defaultFlag
      ? buildBriefFlag(identityId, defaultFlag.groups?.flag ?? "", await defaultFlag.file.data)
      : undefined,
  };
}
