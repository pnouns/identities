import React from "react";
import {
  AspectRatio,
  Center,
  Code,
  Heading,
  Image,
  Spinner,
  Stack,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import { IdentityListName, useIdentityList } from "@idfyi/react";
import { CompiledIdentityListItem } from "@idfyi/dto/out/CompiledIdentityList";
import { renderTextBlock } from "@idfyi/react";
import { Link } from "./Link";
import { TextBlock } from "./TextBlock";

export const IdentityListDisplayItem: React.FC<{
  identity: CompiledIdentityListItem,
}> = ({ identity }) => {
  const summary = identity.summary;
  /*const element = summary ? renderTextBlock(summary, {
    link: (url, text) => <Link path={url} external>{ text }</Link>,
    identityLink: (id, name) => <Link path={`/${id}/`}>{ name }</Link>,
    glossaryLink: (id, name) => <Link path={`/glossary/${id}/`}>{ name }</Link>,
  }) : (<></>);*/
  return (
    <>
      <Tr>
        <Td>
          <AspectRatio ratio={5/3} maxW="200px" minW="100px">
            <Image src={(identity.defaultFlag && identity.defaultFlag.rect && identity.defaultFlag.rect.svg)
              ? identity.defaultFlag.rect.svg
              : "/placeholder/flags/placeholder/placeholder.svg"} />
          </AspectRatio>
        </Td>
        <Td>
          <Heading size="md">
            <Link path={`/${identity.id}/`}>
              { identity.name }
            </Link>
          </Heading>
          { summary && <TextBlock textBlock={summary} /> }
        </Td>
      </Tr>
    </>
  );
}

export const IdentityListDisplay: React.FC<{
  list: IdentityListName;
}> = ({
  list,
}) => {
  const { isLoading, data: identities } = useIdentityList(list);
  return (
    <>
      <Table>
        <TableCaption>
          <Code>
            https://identities.fyi/{list}.identities.json
          </Code>
        </TableCaption>
        <Tbody>
          {
            isLoading && (
              <Tr>
                <Td>
                  <Stack>
                    <Center>
                      <Spinner />
                    </Center>
                    <Center>
                      <Text>
                        Loading...
                      </Text>
                    </Center>
                  </Stack>
                </Td>
              </Tr>
            )
          }
          {
            !isLoading && identities && identities.identities.map(i => (
              <IdentityListDisplayItem key={i.id} identity={i} />
            ))
          }
        </Tbody>
      </Table>
    </>
  );
};
