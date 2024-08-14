import { useEffect, useState, useContext } from "react";
import { useApi } from "../hooks/useApi";
import { useHistory } from "react-router";
// import Editor from '../components/Editor';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill/core";
import alien from "../../public/alien.png";
import {
  colorFill,
  heart,
  heartCircle,
  chatbubbleOutline,
  bookmarkOutline,
  shareOutline,
  checkmarkOutline,
  settingsOutline,
  personOutline,
  createOutline,
} from "ionicons/icons";
import {
  IonButton,
  IonText,
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
import "./Tab1.css";
import SignIn from "../components/SignIn";
import CreateAccount from "../components/CreateAccount";
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
  const [localEmail, setLocalEmail] = useState(localStorage.getItem("user"));
  const [menuType, setMenuType] = useState("overlay");
  const [loggedIn, setLoggedIn] = useState("logged out");
  const [email, setEmail] = useState("logged out");
  const [userName, setUserName] = useState("logged out");
  const history = useHistory();
  const [loginToggle, setLoginToggle] = useState<boolean>(true);
  const { createUser } = useApi();

  // useEffect(() => {
  //   if (user?.session.accessToken) {
  //     console.log('logged in')
  //   } else {
  //     getUser()
  //   }
  // }, [user])

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
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
            <div className="flexSetting">
              <IonIcon icon={settingsOutline}></IonIcon>
              <div>Settings</div>
            </div>
            <div className="flexSetting">
              <IonIcon icon={personOutline}></IonIcon>
              <div>Profile</div>
            </div>
            <div className="flexSetting">
              <IonIcon icon={createOutline}></IonIcon>
              <div>Messages</div>
            </div>
            <div className="flexSetting">
              <IonIcon icon={bookmarkOutline}></IonIcon>
              <div>Bookmarks</div>
            </div>
            <div>
              <div>buttons</div>
              <IonMenuToggle>
                <IonButton
                  onClick={() => {
                    handleLogout();
                    localStorage.removeItem("user");
                    history.push("/tab1");
                  }}
                >
                  Logout
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
