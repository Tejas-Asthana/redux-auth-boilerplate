import axios from "axios";
import { GET_MESSAGES, MESSAGES_LOADED, LOAD_MESSAGES_ERROR } from "./types.js";
import { returnErrors } from "./error";
import { generateTokenConfig } from "./auth";

export const getMessages =
  ({ conversationId = null }) =>
  (dispatch, getState) => {
    // dispatch user loading
    dispatch({ type: GET_MESSAGES });

    axios
      .get(
        "http://localhost:5000/api/messages/" + conversationId,
        generateTokenConfig(getState)
      )
      .then((res) => dispatch({ type: MESSAGES_LOADED, payload: res.data }))
      .catch((err) => {
        // throw err;
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({ type: LOAD_MESSAGES_ERROR });
      });
  };
