import { Type } from "class-transformer";
import { IsDefined, IsOptional, IsString, MinLength, ValidateNested } from "class-validator";
import { CompiledBriefFlag } from "./compiled-util/CompiledBriefFlag";
import { CompiledTextBlock } from "./compiled-util/CompiledTextBlock";

export class CompiledIdentityIndexFile {

  /**
   * The machine-variant of the identity name.
   */
  @IsString()
  id: string;

  /**
   * The display name of the identity.
   */
  @IsString()
  @MinLength(2)
  name: string;

  @ValidateNested()
  @IsDefined()
  @Type(() => CompiledTextBlock)
  description: CompiledTextBlock;

  @IsOptional()
  @ValidateNested()
  @Type(() => CompiledBriefFlag)
  defaultFlag?: CompiledBriefFlag;

}

