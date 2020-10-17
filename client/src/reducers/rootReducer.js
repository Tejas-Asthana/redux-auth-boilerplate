import { combineReducers } from "redux";
import ConsoleLogger from "./consoleLogger";
import AuthReducer from "./authReducer";
import ErrorReducer from "./errorReducer";

export default combineReducers({
  consoleData: ConsoleLogger,
  auth: AuthReducer,
  error: ErrorReducer,
});
