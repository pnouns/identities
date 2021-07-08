import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { CompiledImageLinks } from "./CompiledImageLinks";

/**
 * A short description of a flag, intended to be used in elements such as `CompiledIdentityListItem`.
 */
export class CompiledBriefFlag {

  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  alias?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CompiledImageLinks)
  square?: CompiledImageLinks;

  @IsOptional()
  @ValidateNested()
  @Type(() => CompiledImageLinks)
  rect?: CompiledImageLinks;

}
