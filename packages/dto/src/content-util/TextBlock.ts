import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { Remix } from "./Remix";

/**
 * A block of text with associated metadata.
 */
export class TextBlock {

  @IsString()
  text: string;

  /**
   * If this text is significantly based on a licensed work,
   * the attribution to said work(s).
   */
  @IsOptional()
  @Type(() => Remix)
  @ValidateNested()
  remix?: Remix[];

}
