import { IsOptional, IsUrl } from "class-validator";

/**
 * Pointer in the direction of where an asset was found.
 */
export class ItemSource {

  /**
   * A link to the official/original source.
   */
  @IsOptional()
  @IsUrl()
  url: string;

  /**
   * A link to the Internet Archive for the provided URL.
   */
  @IsOptional()
  @IsUrl()
  archive: string;

}
