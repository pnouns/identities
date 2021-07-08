import {
  AspectRatio,
  Box,
  Code,
  Container,
  Heading,
  Image,
} from "@chakra-ui/react";
import React from "react";
import { useParams } from "react-router-dom";
import { useIdentity } from "@idfyi/react";
import { Header } from "../../components/Header";
import { ErrorPage } from "../ErrorPage";
import { TextBlock } from "../../components/TextBlock";

const Identity: React.FC<{}> = () => {
  const { identity: identityId } = useParams<{ identity: string }>();
  const { isLoading, data: identity, error } = useIdentity(identityId);
  if(isLoading || !identity) {
    return (
      <>
        <Header />
        <Container maxW="container.md">
          <Heading as="h2" size="2xl" textAlign="center" paddingTop="2" paddingBottom="1">
            Loading...
          </Heading>
        </Container>
      </>
    );
  }
  if(error) {
    return <ErrorPage error={error} />;
  }
  return (
    <>
      <Header />
      <Container maxW="container.md">
        <Heading as="h2" size="2xl" textAlign="center" paddingTop="2" paddingBottom="1">
          {identity.name}
        </Heading>
        { identity.defaultFlag && identity.defaultFlag.rect && identity.defaultFlag.rect.svg && (
          <>
            <AspectRatio ratio={5/3} maxW="100%" minW="200px">
              <Image src={identity.defaultFlag.rect.svg} />
            </AspectRatio>
            <Box pb="2" textAlign="center">
              <Code>
                https://identities.fyi{identity.defaultFlag.rect.svg}
              </Code>
            </Box>
          </>
        )}
        { identity && <TextBlock textBlock={identity.description} /> }
        <Box pt="4" textAlign="center">
          <Code>
            https://identities.fyi/{identityId}/index.json
          </Code>
        </Box>
      </Container>
    </>
  );
};

export default Identity;
