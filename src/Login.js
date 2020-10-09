import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import Main from "./Main";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "./index.css";

const options = {
  timeout: 5000,
  position: "bottom center"
};

const App = () => (
  <Provider template={AlertTemplate} {...options}>
    <Main />
  </Provider>
);
 
ReactDOM.render(
  <Main/>,
  document.getElementById("root")
);
