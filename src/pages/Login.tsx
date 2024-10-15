import { useEffect, useState, useContext } from "react";
import { useApi } from "../hooks/useApi";
import { useHistory } from "react-router";
// import Editor from '../components/Editor';
import "react-quill/dist/quill.snow.css";
import Quill from "quill/core";
import alien from "../../public/alien.png";
import {
  bookmarkOutline,
  settingsOutline,
  personOutline,
  createOutline,
} from "ionicons/icons";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonMenuToggle,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
  useIonLoading,
  IonMenu,
  IonImg,
} from "@ionic/react";
import { supabase } from "../components/supaBase";
import "../theme/Tab1.css";
import SignIn from "../components/loginComponents/SignIn";
import CreateAccount from "../components/loginComponents/CreateAccount";
import { MyContext } from "../providers/postProvider";
import Menu from "../components/Menu";

const Login: React.FC = () => {
  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();
  const {
    posts,
    myPosts,
    setPosts,
    setMyPosts,
    updatePost,
    getAllPosts,
    myInfo,
  } = useContext(MyContext);
  const history = useHistory();
  const [loginToggle, setLoginToggle] = useState<boolean>(true);

  // useEffect(() => {
  //   if (user?.session.accessToken) {
  //     console.log('logged in')
  //   } else {
  //     getUser()
  //   }
  // }, [user])

  const handleLogout = async () => {
    console.log('hitting logout in login')
    try {
      const { error } = await supabase.auth.signOut();
      localStorage.removeItem("user");
      history.push("/tab1");
      console.log("You Logged Out");
      if (error) {
        console.log("this is logout error", error);
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
                  Log
                </IonButton>
              </IonMenuToggle>
            </div>
          </div>
        </IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <div className="centerAlien">
              <div className="imageContainer">
                <IonImg src={alien}></IonImg>
              </div>
            </div>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {loginToggle ? (
            <>
              <SignIn setToggle={setLoginToggle} />
            </>
          ) : (
            <>
              <CreateAccount setToggle={setLoginToggle} />
            </>
          )}
        </IonContent>
      </IonPage>
    </>
  );
};

export default Login;
