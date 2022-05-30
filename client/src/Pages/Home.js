import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { loadUser } from "../actions/authActions";
import PvtPage from "../components/pvtPageBtn";
import "../App.css";

let App = (props) => {
  const [searchVal, setsearchVal] = useState("");

  useEffect(() => {
    props.loadUser();
  }, []);

  const friends = [
    {
      username: "Tejas Asthana",
      email: "test1@email",
      chat: [],
    },
    {
      username: "Tejas Asthana",
      email: "test1@email",
      chat: [],
    },
    {
      username: "Tejas Asthana",
      email: "test1@email",
      chat: [],
    },
  ];

  return props.isAuthenticated ? (
    <>
      <div className="App">
        {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <br />
        
      </header> */}
        <div className="container-fluid">
          <div className="wrapper row p-0">
            <div className="col-4 ">
              <input
                type="text"
                className="searchbar"
                value={searchVal}
                onChange={(e) => setsearchVal(e.value)}
                placeholder="Search your friends here"
              />
              <h1 className="text-left text-white">Recent Chat</h1>
              <ul type="none" className="text-left p-0 m-0">
                {friends.map((friend) => {
                  return (
                    <li className="friend-list-item">{friend.username}</li>
                  );
                })}
              </ul>
              <h1 className="mt-5 text-left text-white">Friends</h1>
              <ul type="none" className="text-left p-0 m-0">
                {friends.map((friend) => {
                  return (
                    <li className="friend-list-item">{friend.username}</li>
                  );
                })}
              </ul>
            </div>
            <div className="col-8 chat-window ">
              <div className="chat-msgs-window"></div>
              <div className="chat-input-wrapper">
                <div className="row">
                  <div className="col-12"></div>
                  <div className="col-12 align-items-center">
                    <input type="text"></input>
                  </div>
                  <div className="col-12"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <>{props.history.push("/login")}</>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
});

export default connect(mapStateToProps, { loadUser })(App);
