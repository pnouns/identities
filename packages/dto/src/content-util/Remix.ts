import { Type } from "class-transformer";
import { IsDefined, IsEnum, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
import { License } from "../util/License.enum";

export enum RemixPageType {
  ARTICLE = "article",
}

export class RemixPage {

  /**
   * The type of resource fetched.
   * Used primarily to display the attribution.
   */
  @IsEnum(RemixPageType)
  type: RemixPageType;

  /**
   * The name of the page or resource used.
   */
  @IsString()
  name: string;

  /**
   * A URL to the resource, if one is readily available.
   */
  @IsOptional()
  @IsUrl()
  url?: string;

}

/**
 * Defines an external source that was used for some or all of the content of a section -
 * sources _must_ be licensed correctly to be used (e.g. Creative Commons, etc.)
 */
export class Remix {

  /**
   * The license that content was released under.
   */
  @IsEnum(License)
  license: License;

  /**
   * The source of the remix.
   */
  @Type(() => RemixPage)
  @ValidateNested()
  @IsDefined()
  page: RemixPage;

}
