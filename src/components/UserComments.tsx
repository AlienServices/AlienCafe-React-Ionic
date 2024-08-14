import { useEffect, useState, useRef, useCallback, useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { useApi } from "../hooks/useApi";
import {
  colorFill,
  heart,
  heartCircle,
  chatbubbleOutline,
  bookmarkOutline,
  shareOutline,
  checkmarkOutline,
} from "ionicons/icons";
// import Editor from '../components/Editor';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill/core";
import Post from "../pages/View/[id]";
import { supabase } from "./supaBase";
import {
  IonButton,
  IonNav,
  IonChip,
  IonAvatar,
  IonContent,
  IonCard,
  IonNavLink,
  IonRouterLink,
  IonHeader,
  IonRoute,
  IonInput,
  IonRouterOutlet,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
  useIonLoading,
} from "@ionic/react";
import "../pages/Tab3.css";
import Page from "../pages/View/[id]";
import Profile from "../pages/Profile/[id]";
import { post } from "../utils/fetch";
import { MyContext } from "../providers/postProvider";

const UserComments = ({ id }: { id: string }) => {

  const { myInfo } = useContext(MyContext);
  const [comments, setComments] = useState()
  const [comment, setComment] = useState()

  useEffect(() => {
    getUserComments()
  }, [])


  const getUserComments = async () => {
    try {
      const result = await fetch(
        `http://localhost:3000/api/getUserComments?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const post = await result.json();
      setComments(post.comment)
      console.log(post)
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };



  return (
    <>      
      <IonList>
        {comments?.map((comment: string) => {
          return (
            <IonItem lines="none">
              <IonCard className="cardComment">
                <div>
                  <div>
                    <div className="userName">{comment.username}</div>
                    {/* <div>{comment.date}</div> */}
                  </div>
                  <div className="comment">{comment.comment}</div>
                </div>
              </IonCard>
            </IonItem>
          )
        })}
      </IonList>
    </>
  );
};

export default UserComments;
