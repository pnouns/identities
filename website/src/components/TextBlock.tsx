import { CompiledTextBlock } from "@idfyi/dto";
import { renderTextBlock, RenderTextBlockParams } from "@idfyi/react/out/src/renderTextBlock";
import React from "react";
import { renderTextBlockParams } from "../util/renderTextBlockParams";
import "./TextBlock.scss";

export const TextBlock: React.FC<{
  textBlock: CompiledTextBlock,
  opts?: RenderTextBlockParams,
}> = ({ textBlock, opts }) => {
  const content = renderTextBlock(textBlock, {
    ...renderTextBlockParams,
    ...opts,
  });
  return (
    <div className="adoc-content">
      { content }
    </div>
  );
}
