import { GET_CONVERSATIONS, CONVERSATIONS_LOADED } from "../actions/types";

const initialState = {
  conversations: "loading",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_CONVERSATIONS:
      return state;
    case CONVERSATIONS_LOADED:
      return [...action.payload];

    default:
      return state;
  }
}
