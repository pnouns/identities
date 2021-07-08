import React from "react";
import { Container, Heading, Text } from "@chakra-ui/react";
import { Header } from "../../components/Header";
import { IdentityListDisplay } from "../../components/IdentityListDisplay";

const Homepage: React.FC<{}> = () => {
  return (
    <>
      <Header />
      <Container maxW="container.xl">
        <Heading as="h2" size="2xl" textAlign="center" paddingTop="2" paddingBottom="1">
          Queer Identities
        </Heading>
        <Text fontSize="lg" textAlign="center">
          A quick reference for LGBTQIA+ identities
        </Text>
        <IdentityListDisplay list="homepage" />
      </Container>
      <Container maxW="container.md">
        <Heading as="h3" size="lg" textAlign="center" paddingTop="2" paddingBottom="1">
          Flag and Identity API
        </Heading>
        <Text fontSize="lg" textAlign="center">
          All text and images on this site are available via API and hotlinking.
        </Text>
        <Text>
          Text is mostly (but not completely) licensed under a Creative Commons BY-SA 3.0 license.
          Make sure you properly attribute and license content used.<br />
          API requuests will include required licensing and attribution information as needed.
        </Text>
      </Container>
    </>
  );
}

export default Homepage;
