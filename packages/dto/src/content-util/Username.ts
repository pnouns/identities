import { IsEnum, IsString } from "class-validator";
import { Platform } from "./Platform";

/**
 * Someone's username on a platform.
 */
export class Username {

  @IsString()
  name: string;

  @IsEnum(Platform)
  platform: Platform;

}
