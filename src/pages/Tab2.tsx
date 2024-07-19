import {
  IonContent,
  IonHeader,
  IonPage,
  IonNavLink,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonCardSubtitle,
  IonIcon,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Tab2.css";
import MyPosts from "../components/MyPosts";
import Category from "../components/Category";
import { logoIonic } from "ionicons/icons";
import { useEffect, useState, useContext } from "react";
import { MyContext } from "../providers/postProvider";
import Replies from "../components/Replies";
import Page from "../pages/Edit";

const Tab2 = () => {
  const [choices, setChoices] = useState({
    posts: 1,
    replies: 0,
    likes: 0,
    categories: 0,
  });
  // const [posts, setPosts] = useState(0)
  const {
    posts,
    myPosts,
    setPosts,
    setMyPosts,
    updatePost,
    getAllPosts,
    myInfo,
  } = useContext(MyContext);
  const [replies, setReplies] = useState(0);
  const [likes, setLikes] = useState(1);
  const [categories, setCategories] = useState(0);

  return (
    <IonPage>
      <IonCard className="noMargin" color={"light"}>
        <IonIcon icon={logoIonic} size="large"></IonIcon>
        <IonCardHeader>
          <IonCardTitle>{myInfo?.username}</IonCardTitle>
          {/* <IonNavLink routerDirection="forward" component={() => <Page />}>
            <div>edit profile</div>
          </IonNavLink> */}
        </IonCardHeader>
        <IonCardContent>{myInfo?.bio}</IonCardContent>
        <div className="flexChoice">
          <div
            className="smallTitle"
            onClick={() => {
              setChoices({
                posts: 1,
                replies: 0,
                likes: 0,
                categories: 0,
              });
            }}
          >
            Posts
          </div>
          <div
            className="smallTitle"
            onClick={() => {
              setChoices({
                posts: 0,
                replies: 1,
                likes: 0,
                categories: 0,
              });
            }}
          >
            Replies
          </div>
          <div
            className="smallTitle"
            onClick={() => {
              setChoices({
                posts: 0,
                replies: 0,
                likes: 1,
                categories: 0,
              });
            }}
          >
            Likes
          </div>
          <div
            className="smallTitle"
            onClick={() => {
              setChoices({
                posts: 0,
                replies: 0,
                likes: 0,
                categories: 1,
              });
            }}
          >
            Categories
          </div>
        </div>
      </IonCard>
      {choices.replies ? (
        <>
          <Replies />
        </>
      ) : choices.posts ? (
        <>
          <MyPosts />
        </>
      ) : choices.likes ? (
        <>Likes</>
      ) : choices.categories ? (
        <>
          <Category />
        </>
      ) : (
        // <MyPosts></MyPosts>
        <></>
      )}
    </IonPage>
  );
};

export default Tab2;
