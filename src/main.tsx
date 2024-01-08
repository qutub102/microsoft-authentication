import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { EventType, PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authconfig.ts";

let msalInstance: any = null;
async function initialiseMSAL() {
  msalInstance = new PublicClientApplication(msalConfig);
  await msalInstance.initialize()
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
  }

  msalInstance.addEventCallback(
    (event) => {
      // set active account after redirect
      if (
        event.eventType === EventType.LOGIN_SUCCESS &&
        event.payload.account
      ) {
        const account = event.payload.account;
        msalInstance.setActiveAccount(account);
      }
    },
    (error) => {
      console.log("error", error);
    }
  );

  console.log("get active account", msalInstance.getActiveAccount());

  // handle auth redired/do all initial setup for msal
  msalInstance
    .handleRedirectPromise()
    .then((authResult: any) => {
      // Check if user signed in
      const account = msalInstance.getActiveAccount();
      console.log("redirect function - ", account)
      if (!account) {
        // redirect anonymous user to login page
        msalInstance.loginRedirect();
      }
    })
    .catch((err) => {
      // TODO: Handle errors
      console.log(err);
    });
}
initialiseMSAL();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>
);
