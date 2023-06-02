import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { createGlobalStyle } from "styled-components";

import Router from "./Router";
import initFirebase from "./services/firebase";
import reportWebVitals from "./reportWebVitals";
import { COLORS, GRID } from "@ditointernet/uai-foundation";

initFirebase();

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');

  #root {
    height: 100%;
    padding: 0;
  }

  #google-button {
    display: flex;
    align-items: center;
    border: none;
    width: 200px;
    height: 40px;
    background-color: ${COLORS.WHITE};
    padding: ${GRID(1)};
    cursor: pointer;
    border-radius: 3px;
    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.25);
    transition: box-shadow 0.3s;

    span {
      font-family: "Roboto", sans-serif;
      font-weight: bold;
      font-size: 14px;
      color: #757575;
    }

    svg {
      width: 18px;
      height: 18px;
      margin-right: ${GRID(3)};
    }

    &:hover {
      box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.25);
    }
  }
`;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GlobalStyle />
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
