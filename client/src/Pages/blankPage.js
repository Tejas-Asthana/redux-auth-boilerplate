import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { loadUser } from "../actions/auth";

let BlankPage = (props) => {
  useEffect(() => {
    props.loadUser();
  }, []);

  return props.isAuthenticated ? (
    <>
      <h1>Blank Page</h1>
    </>
  ) : (
    <>{props.history.push("/login")}</>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
});

export default connect(mapStateToProps, { loadUser })(BlankPage);
