import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  layerStyles: {
    "strength-bold-green": {
      bg: "green.100",
      color: "green.900",
      border: "2px solid",
      borderColor: "green.700",
    },
    "strength-semi-bold-green": {
      bg: "green.50",
      color: "green.600",
      border: "2px solid",
      borderColor: "green.700",
    },
    "strength-green": {
      bg: "green.50",
      color: "green.700",
      border: "2px solid",
      borderColor: "green.400",
    },
    "strength-warning": {
      bg: "yellow.50",
      color: "yellow.700",
      border: "2px solid",
      borderColor: "yellow.600",
    },
    "strength-bold-warning": {
      bg: "yellow.100",
      color: "yellow.900",
      border: "2px solid",
      borderColor: "yellow.900",
    },
    "strength-critical": {
      bg: "red.50",
      color: "red.600",
      border: "2px solid",
      borderColor: "red.800",
    },
    "strength-bold-critical": {
      bg: "red.100",
      color: "red.900",
      border: "2px solid",
      borderColor: "red.900",
    },
  },
  textStyles: {
    "strength-bold-green": {
      fontWeight: "bold",
    },
    "strength-semi-bold-green": {
      fontWeight: "semibold",
    },
    "strength-bold-warning": {
      fontWeight: "bold",
    },
    "strength-bold-critical": {
      fontWeight: "bold",
    },
  },
});
