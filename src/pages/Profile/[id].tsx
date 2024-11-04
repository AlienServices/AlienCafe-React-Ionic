import {
  IonContent,
  IonRouterLink,
  IonPage,
  IonCard,
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonImg,
} from "@ionic/react";
import "../../theme/Tab2.css";
import { useHistory } from 'react-router-dom';
import {
  arrowBackOutline,
} from "ionicons/icons";
import Category from "../../components/Category";
import { useEffect, useState, useContext } from "react";
import { MyContext } from "../../providers/postProvider";
import { post } from "../../utils/fetch";
import UserPosts from "../../components/UserPosts";

const Profile = ({ id }: { id: string }) => {
  const history = useHistory();
  const [choices, setChoices] = useState({
    posts: 1,
    replies: 0,
    likes: 0,
    categories: 0,
  });
  const {
    myInfo,
    setMyInfo,
  } = useContext(MyContext);
  const [userInfo, setUserInfo] = useState<{
    email: string;
    id: string;
    username: string;
    bio: String;
  }>({ email: "", id: "", username: "", bio: "" });

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

  const goHome = () => {
    history.goBack();
  };

  // console.log(userInfo);
  return (
    <IonPage>
      <IonContent>
        <IonCard className="noMargin" color={"light"}>

          <div className="brown" style={{ height: '110px' }}>
            <div className="leftMiddle">
              <div onClick={() => {goHome()}}>
                <IonIcon
                  style={{ paddingTop: "40px" }}
                  size="large"
                  icon={arrowBackOutline}
                ></IonIcon>
              </div>
              <div className="logoContainer" style={{ top: '60px' }}>
                <IonImg style={{ width: '60px', height: '60px' }} src="/AlienCafeLogo1.png"></IonImg>
              </div>
            </div>
          </div>
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
