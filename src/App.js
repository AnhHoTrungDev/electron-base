import React from "react";
import "./App.css";
import { HashRouter, Route, Switch } from "react-router-dom";
import { print } from "./common/print";
import ListPrint from "./components/list-print/index";
import 'antd/dist/antd.css'
function App() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/" exact component={ListPrint} />
        {/* <Route path="/setting" exact sensitive component={Setting} /> */}
      </Switch>
    </HashRouter>
  );
}

export default App;
