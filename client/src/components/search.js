import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { getFriends } from "../actions/user";
import Add from "../imgs/add-friend.svg";

function Search(props) {
  const [searchVal, setsearchVal] = useState("");
  const [searchRes, setSearchRes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFailed, setLoadingFailed] = useState(false);
  const [added, setAdded] = useState(false);

  let config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": props.token,
    },
  };

  const handleSearch = () => {
    setLoading(true);
    axios
      .get("/api/user/searchUsers/" + searchVal, config)
      .then((res) => {
        setSearchRes(res.data);
        setsearchVal("");
        setLoading(false);
      })
      .catch((err) => {
        throw err;
      });
  };

  const addFriend = (id) => {
    setLoading(true);
    axios
      .post(`/api/user/friends/add/${props.user._id}/${id}`, config)
      .then((res) => {
        setLoading(false);
        setAdded(true);
        setSearchRes([]);
        props.getFriends();
      })
      .catch((err) => {
        setLoading(false);
        setLoadingFailed(true);
        throw err;
      });
  };

  // const added = () => {};

  const SearchFriendResults = () => {
    return searchRes.map((friend, indx) => {
      return (
        <li key={indx} className="each-srch-rslt row justify-content-between">
          <div className="col-6 text-left">{friend.username}</div>
          <div
            role="button"
            type="button"
            onClick={() => addFriend(friend._id)}
            className="col-6 text-right"
          >
            {loading ? (
              <div>Loading...</div>
            ) : loadingFailed ? (
              <div>Failed...</div>
            ) : props.friends.find((f) => friend._id === f._id) ? (
              <div>Added</div>
            ) : (
              <div>
                <img src={Add} style={{ width: "25px" }} />
              </div>
            )}
          </div>
        </li>
      );
    });
  };

  return props.isAuthenticated ? (
    <div className="row align-items-center mb-5">
      <div className="col-10">
        <input
          type="text"
          className="searchbar"
          value={searchVal}
          onChange={(e) => setsearchVal(e.target.value)}
          placeholder="Search your friends by username"
        />
      </div>
      <div
        className="col align-self-center go-btn"
        type="button"
        onClick={handleSearch}
      >
        Go
      </div>
      <ul type="none" className="col-12 srch-res p-0 m-0">
        <SearchFriendResults />
      </ul>
    </div>
  ) : (
    <>{props.history.push("/login")}</>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  token: state.auth.token,
  user: state.auth.user,
  error: state.error,
});

export default connect(mapStateToProps, { getFriends })(Search);
