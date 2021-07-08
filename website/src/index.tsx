import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { lazy } from "@loadable/component";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Center, ChakraProvider, CircularProgress } from "@chakra-ui/react";
import { IdentityAPIProvider } from "@idfyi/react";
import { theme } from "./theme";

const Homepage = lazy(() => import("./pages/homepage/Homepage"));
const Identity = lazy(() => import("./pages/identity/Identity"));
const API = lazy(() => import("./pages/api"));

export const Loading: React.FC<{}> = () => {
  return (
    <Center h="100%">
      <CircularProgress isIndeterminate />
    </Center>
  );
};


const AppRouter: React.FC<{}> = () => {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path="/docs/api/" component={API} />
          <Route exact path="/glossary/:def/" component={Loading} />
          <Route exact path="/:identity/:flag/" component={Loading} />
          <Route exact path="/:identity/" component={Identity} />
          <Route exact path="/" component={Homepage} />
        </Switch>
      </Suspense>
    </Router>
  );
}

const App: React.FC<{}> = () => {
  return (
    <ChakraProvider theme={theme}>
      <IdentityAPIProvider url="/">
        <AppRouter />
      </IdentityAPIProvider>
    </ChakraProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
