import { BrowserRouter } from "react-router-dom";
import { createGlobalStyle } from "styled-components";

import Router from "./Router";
import initFirebase from "./services/firebase";
import AuthProvider from "./containers/AuthProvider";

initFirebase();

const App = () => {
  return (
    <>
      <GlobalStyle />
      <AuthProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </AuthProvider>
    </>
  );
};

const GlobalStyle: any = createGlobalStyle`
  #root {
    height: 100vh;
    padding: 0;
  }

  body {
    font-family: 'Poppins', sans-serif;
  }
`;

export default App;
