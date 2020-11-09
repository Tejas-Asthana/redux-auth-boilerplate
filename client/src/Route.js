import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navbar from "./components/navbar";
import Home from "./Pages/Home";
import PrivatePage from "./Pages/PrivatePage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";

import BlankPage from "./Pages/blankPage";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";

function Routes() {
  return (
    <Provider store={store}>
      <Router>
        <PersistGate persistor={persistor}>
          <Navbar />
          <Route exact path="/" component={Home} />
          <Route exact path="/privatePage" component={PrivatePage} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/blank" component={BlankPage} />
        </PersistGate>
      </Router>
    </Provider>
  );
}

export default Routes;
