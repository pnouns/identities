import { Container, Heading, Text } from "@chakra-ui/react";
import React from "react";

export const ErrorPage: React.FC<{
  error: Error,
}> = ({ error }) => {
  return (
    <>
      <Container maxW="container.md">
        <Heading as="h2" size="2xl" textAlign="center" paddingTop="2" paddingBottom="1">
          404 Page Not Found
        </Heading>
        <Text>
          { error }
        </Text>
      </Container>
    </>
  )
}
