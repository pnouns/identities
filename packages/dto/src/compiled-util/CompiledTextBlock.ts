import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { CompiledRemix } from "./CompiledRemix";

export class CompiledTextBlock {

  /**
   * The complete text, without any markup.
   */
  @IsString()
  plaintext: string;

  /**
   * A copy of the text converted to HTML.
   * HTML should be fully displayable, even with the custom AsciiDoc macros.
   * 
   * Macro output is marked up with `data-` attributes in case you would like
   * to render some or all of the macros with custom components.
   * 
   * For React rendering, see `html-to-react` extension to substitute elements.
   */
  @IsString()
  html: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CompiledRemix)
  remix?: CompiledRemix[];

}
