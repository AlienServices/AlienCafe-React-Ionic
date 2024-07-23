import {
  IonContent,
  IonHeader,
  IonRouterLink,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonCardSubtitle,
  IonIcon,
} from "@ionic/react";
import ExploreContainer from "../../components/ExploreContainer";
import "../Tab2.css";
import MyPosts from "../../components/MyPosts";
import {
  colorFill,
  heart,
  heartCircle,
  chatbubbleOutline,
  bookmarkOutline,
  shareOutline,
  arrowBackOutline,
  backspaceOutline,
  checkmarkOutline,
} from "ionicons/icons";
import Category from "../../components/Category";
import { logoIonic } from "ionicons/icons";
import { useEffect, useState, useContext } from "react";
// import { StringMap } from 'quill';
import { MyContext } from "../../providers/postProvider";
import { post } from "../../utils/fetch";
import UserPosts from "../../components/UserPosts";

const Profile = ({ id }: { id: string }) => {
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
    deletePost,
    myInfo,
    setMyInfo,
  } = useContext(MyContext);
  const [userInfo, setUserInfo] = useState<{
    email: string;
    id: string;
    username: string;
    bio: String;
  }>({ email: "", id: "", username: "", bio: "" });
  const [replies, setReplies] = useState(0);
  const [likes, setLikes] = useState(1);
  const [categories, setCategories] = useState(0);

  useEffect(() => {
    getUserInfo();
  }, []);

  const updateUser = async (
    username: string,
    bio: string,
    following: string[],
  ) => {
    const updateUser = await post({
      url: `http://localhost:3000/api/updateUsers?email=${myInfo.email}`,
      body: {
        bio: bio,
        username: myInfo?.username,
        following,
      },
    });
    setMyInfo(updateUser.update);
    getUserInfo();
  };

  const getUserInfo = async () => {
    try {
      const result = await fetch(
        `http://localhost:3000/api/myInfo?email=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const posts = await result.json();
      setUserInfo(posts.Hello);
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  // console.log(userInfo);
  return (
    <IonPage>
      <IonContent>
        <IonCard className="noMargin" color={"light"}>
          <IonRouterLink href={`/tab1`}>
            <IonIcon
              style={{ paddingTop: "40px" }}
              size="large"
              icon={arrowBackOutline}
            ></IonIcon>
          </IonRouterLink>
          <IonCardHeader>
            <div className="flexWide">
              <IonCardTitle>{userInfo?.username}</IonCardTitle>
              <div>
                {myInfo.email !== id ? (
                  <>
                    {myInfo?.following?.indexOf(id) !== -1 ? (
                      <div>
                        <IonButton
                          onClick={() => {
                            let emailIndex = myInfo?.following?.indexOf(id);
                            let newLikes = myInfo?.following?.toSpliced(
                              emailIndex,
                              1,
                            );
                            updateUser(myInfo?.username, myInfo?.bio, [
                              ...newLikes,
                            ]);
                          }}
                          size="small"
                        >
                          Unfollow?
                        </IonButton>
                      </div>
                    ) : (
                      // <div>                      
                      //   <IonButton
                      //     onClick={() => {
                      //       updateUser(myInfo?.username, myInfo?.bio, [
                      //         ...myInfo.following,
                      //         userInfo.email,
                      //       ]);
                      //     }}
                      //     size="small"
                      //   >
                      //     Follow
                      //   </IonButton>
                      // </div>
                      <></>
                    )}
                  </>
                ) : (
                  // <>Its you Mf</>
                  <></>
                )}
              </div>
            </div>
          </IonCardHeader>
          <IonCardContent>{userInfo?.bio}</IonCardContent>
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
          <>replies</>
        ) : choices.posts ? (
          <>
            <UserPosts />
          </>
        ) : choices.likes ? (
          <>Likes</>
        ) : choices.categories ? (
          <>
            <Category />
          </>
        ) : (
          <>nada</>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Profile;
