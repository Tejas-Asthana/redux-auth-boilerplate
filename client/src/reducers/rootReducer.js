import { combineReducers } from "redux";
import Friends from "./friends";
import Conversations from "./conversations";
import AuthReducer from "./auth";
import ErrorReducer from "./error";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "error", "friends", "conversations"],
};

const rootReducer = combineReducers({
  friends: Friends,
  conversations: Conversations,
  auth: AuthReducer,
  error: ErrorReducer,
});

export default persistReducer(persistConfig, rootReducer);
