import { IsOptional, IsUrl } from "class-validator";

/**
 * Describes resources or other sources that can be linked.
 */
export class MoreInfo {

  @IsOptional()
  @IsUrl()
  url?: string;

}
