import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { CompiledTextBlock } from "./compiled-util";
import { CompiledBriefFlag } from "./compiled-util/CompiledBriefFlag";

export class CompiledIdentityListItem {

  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CompiledTextBlock)
  summary?: CompiledTextBlock;

  @IsOptional()
  @ValidateNested()
  @Type(() => CompiledBriefFlag)
  defaultFlag?: CompiledBriefFlag;

}

export class CompiledIdentityList {

  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => CompiledIdentityListItem)
  identities: CompiledIdentityListItem[];
}
