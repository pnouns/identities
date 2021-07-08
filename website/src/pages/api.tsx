import { Box } from "@chakra-ui/react";
import React from "react";
import { RedocStandalone } from 'redoc';

const API: React.FC<{}> = () => {
  return (
    <Box bg="white">
      <RedocStandalone specUrl="/api.yaml" options={{
        jsonSampleExpandLevel: 2,
      }} />
    </Box>
  );
}

export default API;
