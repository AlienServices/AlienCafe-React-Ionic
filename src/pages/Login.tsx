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
