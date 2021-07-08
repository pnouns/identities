import React, { useEffect } from "react";
import {
  Badge,
  Button,
  chakra,
  Flex,
  HStack,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "./Link";

export const Header: React.FC<{
}> = ({
}) => {
  const { toggleColorMode: toggleMode } = useColorMode();
  const text = useColorModeValue("dark", "light");
  const bg = useColorModeValue("white", "gray.500");

  return (
    <chakra.header
      pos="sticky"
      top="0"
      zIndex="3"
      bg={bg}
      left="0"
      right="0"
      width="full"
      marginBottom="2"
    >
      <chakra.div height="4.5rem" mx="auto" maxW="8x1">
        <Flex w="100%" h="100%" px="6" align="center" justify="space-between">
          <Flex flex="10" justify="center" textAlign="center">
            <Link path="/" color="white" noUnderline>identities.fyi</Link>
          </Flex>
        </Flex>
      </chakra.div>
    </chakra.header>
  )
}
