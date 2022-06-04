import {
  GET_FRIENDS,
  FRIENDS_LOADED,
  LOAD_FRIENDS_ERROR,
} from "../actions/types";

const initialState = {
  friendList: "loading",
};

export default function (state = [], action) {
  switch (action.type) {
    case GET_FRIENDS:
      return state;
    case FRIENDS_LOADED:
      return [...action.payload];
    case LOAD_FRIENDS_ERROR:
      return [];
    default:
      return state;
  }
}
