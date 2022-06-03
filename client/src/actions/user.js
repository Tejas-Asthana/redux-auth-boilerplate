import axios from "axios";
import { GET_FRIENDS, FRIENDS_LOADED, LOAD_FRIENDS_ERROR } from "./types.js";
import { returnErrors } from "./error";
import { generateTokenConfig } from "./auth";
//GET FRIENDS /api/user/friends

export const getFriends = () => (dispatch, getState) => {
  // dispatch user loading
  dispatch({ type: GET_FRIENDS });

  axios
    .get(
      "/api/user/friends/" + getState().auth.user._id,
      generateTokenConfig(getState)
    )
    .then((res) => dispatch({ type: FRIENDS_LOADED, payload: res.data }))
    .catch((err) => {
      // throw err;
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({ type: LOAD_FRIENDS_ERROR });
    });
};
