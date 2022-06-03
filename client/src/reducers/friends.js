import { GET_FRIENDS, FRIENDS_LOADED } from "../actions/types";

const initialState = {
  friendList: "loading",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_FRIENDS:
      return state;
    case FRIENDS_LOADED:
      return [...action.payload];

    default:
      return state;
  }
}
