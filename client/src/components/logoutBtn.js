import React from "react";
import { connect } from "react-redux";
import { logout } from "../actions/auth";

function LogoutBtn(props) {
  return (
    <button onClick={props.logout} type="button" className="btn btn-danger">
      Logout
    </button>
  );
}

export default connect(null, { logout })(LogoutBtn);
