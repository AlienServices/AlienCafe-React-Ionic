import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonIcon,
  IonImg,
} from "@ionic/react";
import { useIonRouter } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { useEffect, useState, useContext } from "react";
import { MyContext } from "../../providers/postProvider";
import UserPosts from "../../components/UserPosts";
import Category from "../../components/Category";
import "../../theme/Tab2.css";

const Profile = ({ id }: { id: string }) => {
  const router = useIonRouter();
  const { getBaseUrl } = useContext(MyContext);
  const [choices, setChoices] = useState({
    posts: 1,
    replies: 0,
    likes: 0,
    categories: 0,
  });
  const [userInfo, setUserInfo] = useState({
    email: "",
    id: "",
    username: "",
    bio: "",
  });

  useEffect(() => {
    getUserInfo();
  }, [id]);

  const getUserInfo = async () => {
    try {
      const result = await fetch(
        `${getBaseUrl()}/api/users/myInfo?email=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await result.json();
      setUserInfo(data.Hello);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const goHome = () => {
    router.goBack();
  };

  const handleChoiceClick = (key: string) => {
    setChoices({
      posts: key === "posts" ? 1 : 0,
      replies: key === "replies" ? 1 : 0,
      likes: key === "likes" ? 1 : 0,
      categories: key === "categories" ? 1 : 0,
    });
  };

  return (
    <IonPage>
      <IonContent>
        <IonCard className="noMargin" color={"light"}>
          <div className="brown" style={{ height: "110px" }}>
            <div className="leftMiddle">
              <IonIcon
                onClick={goHome}
                style={{ paddingTop: "40px" }}
                size="large"
                icon={arrowBackOutline}
              />
              <div className="logoContainer" style={{ top: "60px" }}>
                <IonImg
                  style={{ width: "60px", height: "60px" }}
                  src="/AlienCafeLogo1.png"
                />
              </div>
            </div>
          </div>
          <IonCardContent>{userInfo?.bio}</IonCardContent>
          <div className="flexChoice">
            {["posts", "replies", "likes", "categories"].map((choice) => (
              <div
                key={choice}
                className="smallTitle"
                onClick={() => handleChoiceClick(choice)}
              >
                {choice.charAt(0).toUpperCase() + choice.slice(1)}
              </div>
            ))}
          </div>
        </IonCard>

        {choices.posts && <UserPosts />}
        {choices.replies && <>replies</>}
        {choices.likes && <>Likes</>}
        {choices.categories && <Category />}
      </IonContent>
    </IonPage>
  );
};

export default Profile;
