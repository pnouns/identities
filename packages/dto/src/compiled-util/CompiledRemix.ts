import { Type } from "class-transformer";
import {
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from "class-validator";
import { RemixPageType } from "../content-util/Remix";
import { License } from "../util/License.enum";

export class CompiledRemixPage {

  @IsEnum(RemixPageType)
  type: RemixPageType;

  @IsString()
  name: string;

  @IsOptional()
  @IsUrl()
  url?: string;

}

/**
 * Defines the external source for some or all of the content of a section -
 * sources _must_ be licensed correctly to be used (e.g. Creative Commons, etc.)
 */
export class CompiledRemix {

  @IsEnum(License)
  license: License;

  /**
   * The source of some or all of the text.
   */
  @Type(() => CompiledRemixPage)
  @ValidateNested()
  @IsDefined()
  page: CompiledRemixPage;

}
