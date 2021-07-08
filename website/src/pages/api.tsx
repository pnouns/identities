import { Box } from "@chakra-ui/react";
import React from "react";
import { RedocStandalone } from 'redoc';
import { Header } from "../components/Header";

const API: React.FC<{}> = () => {
  return (
    <>
      <Header />
      <Box bg="white">
        <RedocStandalone specUrl="/api.yaml" options={{
          jsonSampleExpandLevel: 2,
        }} />
      </Box>
    </>
  );
}

export default API;
