import React from "react";
import { useContext, useRef } from "react";
import { useHistory } from "react-router";
import {
  bookmarkOutline,
  settingsOutline,
  personOutline,
  createOutline,
} from "ionicons/icons";
import { MyContext } from "../providers/postProvider";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonMenu,
  IonMenuToggle,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonIcon
} from "@ionic/react";
import supabase from "../messageComponents/supabaseClient";


export const Menu = () => {
  const menuRef = useRef<HTMLIonMenuElement>(null);
  const { myInfo, setMyInfo } = useContext(MyContext);
  const history = useHistory();


  const handleLogout = async () => {
    console.log('hitting logout in tab 3')
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log("Logout error:", error);
      } else {
        menuRef.current?.close();
        localStorage.removeItem("user");
        setMyInfo({ id: '', content: '', likes: [], email: '', bio: '', username: '', following: [], followers: [], blurhash: '' })
        history.push("/tab1");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <IonMenu side="start" contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>@{myInfo?.username}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="contentContainer">
            <div className="optionsContainer">
              <div className="flexSetting">
                <IonIcon icon={settingsOutline}></IonIcon>
                <div className="setting">Settings</div>
              </div>
              <div className="flexSetting">
                <IonIcon icon={personOutline}></IonIcon>
                <div className="setting">Profile</div>
              </div>
              <div className="flexSetting">
                <IonIcon icon={createOutline}></IonIcon>
                <div className="setting">Messages</div>
              </div>
              <div className="flexSetting">
                <IonIcon icon={bookmarkOutline}></IonIcon>
                <div className="setting">Bookmarks</div>
              </div>
            </div>
            <div>
              <IonMenuToggle>
                <IonButton className="button" size="small"
                  onClick={() => handleLogout}
                >
                  Logout
                </IonButton>
              </IonMenuToggle>
            </div>
          </div>
        </IonContent>
      </IonMenu>
    </>
  );
}

