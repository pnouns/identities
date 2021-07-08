import { Type } from "class-transformer";
import {
  IsBoolean,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from "class-validator";
import { TextBlock } from "./content-util/TextBlock";

/**
 * The source index files describing each identity.
 * 
 * See identities/lesbian/index.yaml.
 */
export class IdentityFileDefinition {

  /**
   * A human-readable name to display.
   */
  @IsString()
  @MinLength(2)
  name: string;

  /**
   * If this identity should be displayed on the homepage.
   */
  @IsOptional()
  @IsBoolean()
  homepage?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => TextBlock)
  summary?: TextBlock;

  @ValidateNested()
  @Type(() => TextBlock)
  description: TextBlock;

}
