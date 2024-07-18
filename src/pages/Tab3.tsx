import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonMenu,
  IonButton,
  IonButtons,
  IonImg,
  IonMenuButton,
  IonToolbar,
  IonMenuToggle,
  useIonRouter,

} from "@ionic/react";
import { useEffect, useState, useRef, useCallback, useContext } from "react";
import { supabase } from "../components/supaBase";
import alien from '../../public/alien.png'
import { useHistory } from "react-router";
import ExploreContainer from "../components/ExploreContainer";
import "./Tab3.css";
import AllPosts from "../components/AllPosts";
import { MyContext } from "../providers/postProvider";

const Tab3: React.FC = () => {

  const { posts, myPosts, setPosts, setMyPosts, updatePost, getAllPosts, myInfo } =
    useContext(MyContext);
  const history = useHistory();
  const menuRef = useRef<HTMLIonMenuElement>(null);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      console.log("You Logged Out");
      if (error) {
        console.log("this is logout error", error);
      } else {
        // Close the menu
        menuRef.current?.close();
        // Remove user from local storage and navigate
        localStorage.removeItem('user');
        history.push("/tab1");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <IonMenu side="start" contentId="main-content" ref={menuRef}>
        <IonHeader>
          <IonToolbar>
            <div className="center">
              <IonTitle >@{myInfo?.username}</IonTitle>
            </div>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="contentContainer">
            <div>Settings</div>
            <div>Profile</div>
            <div>Messages</div>
            <div>Bookmarks</div>
            <div>
              <div>buttons</div>
              
                <IonButton onClick={handleLogout}>Logout</IonButton>
              
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
          <AllPosts />
        </IonContent>
      </IonPage>
    </>
  );
};

export default Tab3;