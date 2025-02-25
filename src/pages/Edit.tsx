import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
  IonTextarea,
} from "@ionic/react";
import "./Tab1.css";

const Login: React.FC = () => {
  const [bio, setBio] = useState("");
  const [userName, setUserName] = useState("");

  return (
    <IonPage>
      <IonContent>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Page</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonItem>
          <IonTextarea
            onIonChange={(e) => setBio(e.detail.value ?? "")}
            placeholder="Bio"
          ></IonTextarea>
        </IonItem>
        <IonItem>
          <IonInput
            onIonChange={(e) => setUserName(e.detail.value ?? "")}
            placeholder="Username"
          ></IonInput>
        </IonItem>

        <IonButton
          onClick={() => {
            // updateUser(myInfo.email, myInfo.following, bio);
          }}
        >
          Done
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
