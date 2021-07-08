import { IsOptional, IsUrl } from "class-validator";

export class CompiledImageLinks {

  @IsOptional()
  @IsUrl({
    require_protocol: false,
    require_host: false,
    require_port: false,
    require_tld: false,
  })
  svg?: string;

}
