import { useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import {
  bookmarkOutline,
  settingsOutline,
  personOutline,
  createOutline,
} from "ionicons/icons";
import {
  IonContent,
  IonHeader,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar,  
  IonIcon,
} from "@ionic/react";
import supabase from "../messageComponents/supabaseClient";
import { UserContext } from "../providers/userProvider";

export const Menu = () => {
  const menuRef = useRef<HTMLIonMenuElement>(null);
  const { myInfo, setMyInfo } = useContext(UserContext);
  const history = useHistory();

  const handleLogout = async () => {
    console.log("hitting logout");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log("Logout error:", error);
      } else {
        menuRef.current?.close();
        localStorage.removeItem("user");
        setMyInfo({
          id: "",
          content: "",
          likes: [],
          email: "",
          bio: "",
          username: "",
          following: [],
          followers: [],
          blurhash: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <IonMenu side="start" contentId="main-content">
        <IonHeader color="tertiary" style={{ backgroundColor: "black" }}>
          <IonToolbar style={{ backgroundColor: "black", textAlign: 'center', paddingTop: '25px' }}>
            <IonTitle>@{myInfo?.username}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="contentContainer">
            <div className="optionsContainer">
              <IonMenuToggle>
                <div
                  onClick={() => {
                    history.push("/settings");
                  }}
                  className="flexSetting"
                >
                  <IonIcon size="large" icon={settingsOutline}></IonIcon>
                  <div className="setting">Settings</div>
                </div>
              </IonMenuToggle>
              <IonMenuToggle>
                <div
                  onClick={() => {
                    history.push("/tab2");
                  }}
                  className="flexSetting"
                >
                  <IonIcon size="large" icon={personOutline}></IonIcon>
                  <div className="setting">Profile</div>
                </div>
              </IonMenuToggle>
              <IonMenuToggle>
                <div
                  onClick={() => {
                    history.push("/tab3");
                  }}
                  className="flexSetting"
                >
                  <IonIcon size="large" icon={createOutline}></IonIcon>
                  <div className="setting">Messages</div>
                </div>
              </IonMenuToggle>
              {/* <IonMenuToggle>
                <div onClick={() => {history.push('/bookmarks')}} className="flexSetting">
                  <IonIcon icon={bookmarkOutline}></IonIcon>
                  <div className="setting">Bookmarks</div>
                </div>
              </IonMenuToggle> */}
              <IonMenuToggle>
                {myInfo?.id ? (
                  <div
                    onClick={() => {
                      history.push("/");
                      menuRef.current?.close();
                      handleLogout();
                    }}
                    className="flexSetting"
                  >
                    <IonIcon size="large" icon={bookmarkOutline}></IonIcon>
                    <div className="setting">Logout</div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      history.push("/");
                      menuRef.current?.close();
                    }}
                    className="flexSetting"
                  >
                    <IonIcon icon={bookmarkOutline}></IonIcon>
                    <div className="setting">Login</div>
                  </div>
                )}
              </IonMenuToggle>
            </div>
          </div>
        </IonContent>
      </IonMenu>
    </>
  );
};
