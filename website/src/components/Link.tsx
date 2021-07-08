import React, { ReactElement } from "react";
import { Link as ChakraLink, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export interface CommonLinkProps {
  path: string;
  newTab?: boolean;
  external?: boolean;
  my?: number | string;
}

export interface LinkProps extends CommonLinkProps {
  color?: string;
  noUnderline?: true;
}

export const Link: React.FC<LinkProps> = ({
  path,
  newTab,
  external,
  color,
  noUnderline,
  my,
  children,
}) => {
  const props = {
    color: color,
    textDecoration: noUnderline ? undefined : "underline",
    target: newTab ? "_blank" : undefined,
    my,
  };
  if(external) {
    return (
      <ChakraLink href={path} {...props}>{ children }</ChakraLink>
    )
  }
  return (
    <ChakraLink
      as={RouterLink}
      to={path}
      {...props}
    >
      { children }
    </ChakraLink>
  );
};

export interface ButtonLinkProps extends CommonLinkProps {
  rightIcon?: ReactElement;
}

export const ButtonLink: React.FC<ButtonLinkProps> = ({
  path,
  newTab,
  external,
  rightIcon,
  children,
  my,
}) => {
  const props = {
    target: newTab ? "_blank" : undefined,
    rightIcon,
    my,
  }
  if(external) {
    return (
      <Button as="a" href={path} {...props}>
        {children}
      </Button>
    );
  }
  return (
    <Button
      as={RouterLink}
      to={path}
      {...props}
    >
      { children }
    </Button>
  );
}
