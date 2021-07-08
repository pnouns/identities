import { Type } from "class-transformer";
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from "class-validator";
import { License } from "../util/License.enum";
import { AuthorAttribution } from "./AuthorAttribution";
import { ItemSource } from "./ItemSource";
import { MoreInfo } from "./MoreInfo";

export class StripeWithHeight {

  @IsString()
  color: string;

  /**
   * The height of the stripe, as a fraction of the flag.
   * 0=no height, 1=entire height of the flag.
   */
  @IsNumber()
  @Max(1)
  @Min(0)
  height: number;

}

/**
 * The data about an actual flag design.
 * See FlagFileDefinition for the broader flag definition,
 * which can include aliases to other flags.
 */
export class FlagDefinition {

  /**
   * A pointer to find the asset again.
   */
   @ValidateNested()
   @Type(() => ItemSource)
   source?: ItemSource;
 
   /**
    * The original author of the flag.
    */
   @ValidateNested()
   @Type(() => AuthorAttribution)
   author?: AuthorAttribution;
 
   /**
    * If found, the license that the flag was published under.
    */
   @IsOptional()
   @IsEnum(License)
   license?: License;
 
   /**
    * If known and useful, a reference to a design directly used as inspiration.
    * 
    * Provide in the form `<identity>/<flag>` for flags that belong to an identity,
    * or `<flag>` for flags that are not connected to a specific identity.
    */
   @IsOptional()
   @IsString()
   "based on"?: string;
 
   /**
    * For flags that have even, horizontal stripes, the list of hex colors
    * that are each row of the flag.
    */
   @IsOptional()
   @IsString({
     each: true,
   })
   stripes?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => StripeWithHeight)
  "uneven stripes"?: StripeWithHeight[];

   @IsOptional()
   @ValidateNested()
   @Type(() => MoreInfo)
   info?: MoreInfo[];

}
