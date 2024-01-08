import "./App.css";
import {
  useMsal,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useIsAuthenticated,
} from "@azure/msal-react";
import { loginRequest } from "./authconfig";
import PageLayout from "./pages/Layout/PageLayout";
import { HashRouter, Route, Routes } from "react-router-dom";
import Chat from "./pages/Chat/Chat";
import { useEffect, useState } from "react";
import { callMsGraph } from "./graph";

function App() {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState<any>(null);

  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isAuthenticated && accounts?.length > 0) {
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        })
        .then((response) => {
          callMsGraph(response.accessToken).then((response) => {
            setGraphData(response);
            console.log("Graph Data response - ", response, accounts);
          });
        });
    }
    // if (!isAuthenticated && accounts.length <= 0) {
    //   console.log("isAuthenticated - ", isAuthenticated);
    //   instance.loginRedirect(loginRequest);
    // }
  }, [isAuthenticated]);

  useEffect(() => {
    console.log("Graph Data - ", graphData);
  }, [graphData]);

  return (
    <div className="App">
      <AuthenticatedTemplate>
        <HashRouter>
          <Routes>
            <Route path="/" element={<PageLayout />}>
              <Route index element={<Chat graphData={graphData} />} />
              <Route path="*" element={<h1>404</h1>} />
            </Route>
          </Routes>
        </HashRouter>
      </AuthenticatedTemplate>
    </div>
  );
}

export default App;
