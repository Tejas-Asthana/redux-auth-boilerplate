import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navbar from "./components/navbar";
import Home from "./Pages/Home";
import PrivatePage from "./Pages/PrivatePage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";

function Routes() {
  return (
    <Router>
      <Navbar />
      <Route exact path="/" component={Home} />
      <Route exact path="/privatePage" component={PrivatePage} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={Signup} />
    </Router>
  );
}

export default Routes;
