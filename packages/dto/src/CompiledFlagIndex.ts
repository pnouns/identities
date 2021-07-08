import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { ItemSource } from "./content-util/ItemSource";
import { AuthorAttribution } from "./content-util/AuthorAttribution";
import { License } from "./util/License.enum";
import { MoreInfo } from "./content-util/MoreInfo";
import { CompiledImageLinks } from "./compiled-util/CompiledImageLinks";

export class CompiledFlagIndex {

  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsBoolean()
  communityContributed: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => ItemSource)
  source?: ItemSource;

  @IsOptional()
  @ValidateNested()
  @Type(() => AuthorAttribution)
  author?: AuthorAttribution;
  
  @IsOptional()
  @IsEnum(License)
  license?: License;

  @IsOptional()
  @IsString()
  basedOn?: string;

  @IsOptional()
  @IsString()
  aliasOf?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => MoreInfo)
  info?: MoreInfo[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CompiledImageLinks)
  square?: CompiledImageLinks;

  @IsOptional()
  @ValidateNested()
  @Type(() => CompiledImageLinks)
  rect?: CompiledImageLinks;

}
