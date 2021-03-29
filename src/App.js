import React from "react";
import "./App.css";
import { HashRouter, Route, Switch } from "react-router-dom";
import { print } from "./common/print";
import ListPrint from "./components/list-print/index";
import "antd/dist/antd.css";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://devcloud7.digihcs.com:26711/graphql",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <HashRouter>
        <Switch>
          <Route path="/" exact component={ListPrint} />
          {/* <Route path="/setting" exact sensitive component={Setting} /> */}
        </Switch>
      </HashRouter>
    </ApolloProvider>
  );
}

export default App;
