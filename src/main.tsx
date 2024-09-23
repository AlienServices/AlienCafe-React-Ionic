import React from "react";
import { createRoot } from "react-dom/client";
import { IonApp, IonPage, IonContent } from "@ionic/react"; // Import Ion components
import App from "./App";
import { ContextProvider } from "./providers/postProvider";
import "@ionic/react/css/core.css"; // Import core CSS
import './main.css'

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <IonApp className="mainPage">
      <IonPage>
        <IonContent>
          <ContextProvider>
            <App />
          </ContextProvider>
        </IonContent>
      </IonPage>
    </IonApp>
  </React.StrictMode>
);
