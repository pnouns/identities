import { convert as htmlToText } from "html-to-text";
import { TextBlock, CompiledTextBlock } from "@idfyi/dto";
import { AsciidocEnvironment } from "../asciidoc-rendering";
import { renderRemix } from "./remix";

export function renderTextBlock(
  renderer: AsciidocEnvironment,
  text: TextBlock,
): CompiledTextBlock {
  const html = renderer.asciidoctor.convert(text.text, { to_file: false, extension_registry: renderer.html });
  if(typeof html !== "string") {
    const text = html.toString();
    console.log(`Didn't get string`, html, text);
    throw new Error("Didn't get string.");
  }
  const plaintext = htmlToText(html, {
    formatters: {
      textContentOnly: (elem, walk, builder, formatOptions) => {
        walk(elem.children, builder);
      },
    },
    selectors: [
      { selector: "a[data-identity]", format: "textContentOnly" },
      { selector: "a[data-glossary]", format: "textContentOnly" },
    ],
  });
  return {
    html,
    plaintext,
    remix: Array.isArray(text.remix) && text.remix.length > 0 ? text.remix.map(renderRemix) : undefined,
  };
}
