import React from "react";
import ReactDOM from "react-dom";
import { Provider, createClient } from "urql";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const client = createClient({
  url: "https://react.eogresources.com/graphql"
});

ReactDOM.render(
  <Provider value={client}>
    <App />
  </Provider>,
  // eslint-disable-next-line no-undef
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
