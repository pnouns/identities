import { Type } from "class-transformer";
import { IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
import { Username } from "./Username";

export class AuthorAttribution {

  /**
   * Someone's name.
   */
  @IsString()
  name?: string;

  /**
   * Someone's online handle.
   */
   @ValidateNested()
   @Type(() => Username)
  username?: Username;

  /**
   * A URL to a profile owned by the author.
   */
  @IsOptional()
  @IsUrl()
  url?: string;

}
