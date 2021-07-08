import { Type } from "class-transformer";
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { FlagDefinition } from "./content-util";

export class FlagFileDefinition {

  /**
   * The name of the flag.
   */
  @IsString()
  name: string;

  /**
   * If this flag was directly sent in by someone who identifies with the label.
   */
  @IsBoolean()
  "community contributed": boolean;

  @IsOptional()
  @IsIn([ true ])
  default?: true;

  /**
   * The description of a flag.
   * 
   * Omit if this is an alias to another flag.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => FlagDefinition)
  flag?: FlagDefinition;

  /**
   * An alternative flag - should be `<identity>/<flag>`.
   */
  @IsOptional()
  @IsString()
  alias?: string;

}
