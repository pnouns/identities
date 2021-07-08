import React from "react";
import { RenderTextBlockParams } from "@idfyi/react/out/src/renderTextBlock";
import { Link } from "../components/Link";
import { Heading } from "@chakra-ui/react";

const headerSize = {
  1: "2xl",
  2: "xl",
  3: "lg",
  4: "md",
  5: "sm",
  6: "xs",
};

type HEADER_VALUE = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
function asHeader(level: number): HEADER_VALUE {
  return `h${level}` as HEADER_VALUE;
}

export const renderTextBlockParams: RenderTextBlockParams = {
  link: (url, text) => <Link path={url} external>{ text }</Link>,
  identityLink: (id, name) => <Link path={`/${id}/`}>{ name }</Link>,
  glossaryLink: (id, name) => <Link path={`/glossary/${id}/`}>{ name }</Link>,
  header: (level, text) => <Heading as={asHeader(level)} size={headerSize[level]}>{text}</Heading>,
};
