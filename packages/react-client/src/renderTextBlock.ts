import React, { useMemo } from "react";
import { Parser, ProcessNodeDefinitions } from "html-to-react";
import { CompiledTextBlock } from "@idfyi/dto";

export interface RenderTextBlockParams {

  /**
   * A generic link rendering method.
   */
  link?: (url: string, text: string) => React.ReactNode,

  /**
   * A specific rendering method for glossary links.
   * Overrides `link` (if provided)
   */
  glossaryLink?: (id: string, name: string) => React.ReactNode,

  /**
   * A specific rendering method for identity links.
   * Overrides `link` (if provided)
   */
  identityLink?: (id: string, name: string) => React.ReactNode,

  /**
   * Replace h1-h6.
   */
  header?: (level: number, text: string) => React.ReactNode;
}

export function renderTextBlock(textBlock: CompiledTextBlock, opts: RenderTextBlockParams = {}): React.ReactElement {
  const parser = useMemo(() => new Parser(), []);
  const isValidNode = () => true;
  const processingInstructions = useMemo(() => {
    const processNodeDefs = new ProcessNodeDefinitions(React);
    const instructions = [
      ...(!opts.identityLink ? [] : [{
        shouldProcessNode: node => node.name === "a"
          && node.attribs
          && node.attribs["data-identity"],
        processNode: (node, children) => {
          return opts.identityLink && opts.identityLink(node.attribs["data-identity"], children);
        },
      }]),
      ...(!opts.glossaryLink ? [] : [{
        shouldProcessNode: node => node.name === "a"
          && node.attribs
          && node.attribs["data-glossary"],
        processNode: (node, children) => {
          return opts.glossaryLink && opts.glossaryLink(node.attribs["data-glossary"], children);
        },
      }]),
      ...(!opts.link ? [] : [{
        shouldProcessNode: node => node.name === "a"
          && node.attribs
          && node.attribs.href
          && !node.attribs["data-identity"]
          && !node.attribs["data-glossary"],
        processNode: (node, children, index) => {
          return opts.link && opts.link(node.attribs.href, children);
        },
      }]),
      ...(!opts.header ? [] : [{
        shouldProcessNode: node => node.name && node.name.length > 0 && node.name[0] === "h",
        processNode: (node, children, index) => {
          return opts.header && opts.header(parseInt(node.name[1], 10), children);
        },
      }]),
      {
        shouldProcessNode: node => true,
        processNode: processNodeDefs.processDefaultNode,
      },
    ];
    return instructions;
  }, [opts]);
  const component = parser.parseWithInstructions(textBlock.html, isValidNode, processingInstructions);
  return component;
}
