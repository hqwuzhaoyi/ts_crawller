import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import LoginPage from "./Pages/Login";
import HomePage from "./Pages/Home";

import "./App.css";

const App: React.FC = () => {
  return (
    <div>
      <HashRouter>
        <Switch>
          <Route path="/" exact component={HomePage}></Route>
          <Route path="/login" exact component={LoginPage}></Route>
        </Switch>
      </HashRouter>
    </div>
  );
};

export default App;
