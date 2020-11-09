import { combineReducers } from "redux";
import ConsoleLogger from "./consoleLogger";
import AuthReducer from "./authReducer";
import ErrorReducer from "./errorReducer";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "error", "consoleData"],
};

const rootReducer = combineReducers({
  consoleData: ConsoleLogger,
  auth: AuthReducer,
  error: ErrorReducer,
});

export default persistReducer(persistConfig, rootReducer);
