import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonMenu,
  IonButtons,
  IonMenuButton,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState, useRef, useCallback, useContext } from "react";
import ExploreContainer from "../components/ExploreContainer";
import "./Tab3.css";
import AllPosts from "../components/AllPosts";
import { MyContext } from "../providers/postProvider";

const Tab3: React.FC = () => {

  const { posts, myPosts, setPosts, setMyPosts, updatePost, getAllPosts, myInfo } =
    useContext(MyContext);
  return (
    <>
      <IonMenu side="start" contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <div className="center">
              <IonTitle >@{myInfo.username}</IonTitle>
            </div>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="contentContainer">
            <div>Settings</div>
            <div>Profile</div>
            <div>Messages</div>
            <div>Bookmarks</div>
          </div>
        </IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>All Posts</IonTitle>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
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
