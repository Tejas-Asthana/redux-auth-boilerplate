import React from "react";
import { Provider } from "react-redux";
import store from "./store/store";

import Routes from "./Route";

function App() {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
}

export default App;
