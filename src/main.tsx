import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { IonApp, IonPage, IonContent } from "@ionic/react";
import App from "./App";
import { ContextProvider } from "./providers/postProvider";
import "@ionic/react/css/core.css";
import "./main.css";
import { StatusBar, Style } from "@capacitor/status-bar";
import { IonReactRouter } from "@ionic/react-router";
import { UserProvider } from "./providers/userProvider";

const container = document.getElementById("root");
const root = createRoot(container!);

const Main = () => {
  useEffect(() => {
    const initializeStatusBar = async () => {
      // Make the status bar overlay the webview
      await StatusBar.setOverlaysWebView({ overlay: true });

      // Set the status bar style (light or dark content)
      await StatusBar.setStyle({ style: Style.Light });
    };

    initializeStatusBar();
  }, []);

  return (
    <React.StrictMode>
      <IonApp className="mainPage">
        <IonPage>
          <IonContent>
            <UserProvider>
              <ContextProvider>
                <App />
              </ContextProvider>
            </UserProvider>
          </IonContent>
        </IonPage>
      </IonApp>
    </React.StrictMode>
  );
};

root.render(<Main />);
