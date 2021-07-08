import AsciiDoctor, { Asciidoctor } from "asciidoctor";

export interface AsciidocRenderOptions {

  /**
   * The base URL to use for links to identities.fyi.
   * Defaults to 'https://identities.fyi'.
   */
  baseUrl?: string;

}

export interface AsciidocEnvironment {
  asciidoctor: Asciidoctor;
  html: Asciidoctor.Extensions.Registry;
}

interface IdMacroOptions {
  name: string;
};

interface GlossaryMacroOptions {
  name: string;
}

export function asciidocRender(options: AsciidocRenderOptions): AsciidocEnvironment {
  const baseUrl = options.baseUrl ?? "https://identities.fyi";
  const asciidoctor = AsciiDoctor();

  const html = asciidoctor.Extensions.create();

  html.inlineMacro("id", function idMacro() {
    this.process(function (parent, target, attributes) {
      const opts: Partial<IdMacroOptions> = typeof attributes === "object" ? attributes : {};
      const name = (opts.name && opts.name.length > 0) ? opts.name : target;
      return this.createInlinePass(parent, `<a href="${baseUrl}/${target}/" data-identity="${target}">${name}</a>`);
    });
  });
  
  html.inlineMacro("def", function glossaryMacro() {
    this.process(function (parent, target, attributes) {
      const opts: Partial<GlossaryMacroOptions> = typeof attributes === "object" ? attributes : {};
      const name = (opts.name && opts.name.length > 0) ? opts.name : target;
      return this.createInlinePass(parent, `<a href="${baseUrl}/glossary/${target}/" data-glossary="${target}">${name}</a>`);
    });
  });

  return {
    asciidoctor,
    html,
  };
}
