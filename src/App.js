import React from "react";
import "./App.css";
import { HashRouter, Route, Switch } from "react-router-dom";
import { print } from "./common/print";
import ListPrint from "./components/list-print/index";
import "antd/dist/antd.css";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import { WebSocketLink } from '@apollo/client/link/ws';

import { split, HttpLink } from '@apollo/client';

import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = new HttpLink({
  uri:"http://devcloud7.digihcs.com:26711/graphql",
});

const wsLink = new WebSocketLink({
  uri: 'ws://devcloud7.digihcs.com:26711/graphql',
  options: {
    reconnect: true
  }
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
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
