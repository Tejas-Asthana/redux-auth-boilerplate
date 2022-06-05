import axios from "axios";
import {
  GET_CONVERSATIONS,
  CONVERSATIONS_LOADED,
  LOAD_CONVERSATIONS_ERROR,
} from "./types.js";
import { returnErrors } from "./error";
import { generateTokenConfig } from "./auth";

export const getConversations = () => async (dispatch, getState) => {
  // dispatch user loading
  dispatch({ type: GET_CONVERSATIONS });

  await axios
    .get(
      "http://localhost:5000/api/conversations/" + getState().auth?.user?._id,
      generateTokenConfig(getState)
    )
    .then((res) => dispatch({ type: CONVERSATIONS_LOADED, payload: res?.data }))
    .catch((err) => {
      dispatch(returnErrors(err?.response?.data, err?.response?.status));
      dispatch({ type: LOAD_CONVERSATIONS_ERROR });
    });
};
