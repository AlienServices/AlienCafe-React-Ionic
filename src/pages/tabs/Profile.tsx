import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonImg,
  useIonViewWillEnter,
  IonIcon,
  IonMenuButton,
  useIonViewDidLeave,
  useIonViewWillLeave,
} from "@ionic/react";
import "../../theme/Tab2.css";
import MyPosts from "../../components/MyPosts";
import Bookmarks from "../../components/Bookmarks";
import Category from "../../components/Category";
import {
  useState,
  useContext,
  SetStateAction,
  useMemo,
} from "react";
import { MyContext } from "../../providers/postProvider";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import UserComments from "../../components/UserComments";
import { UserContext } from "../../providers/userProvider";
import { ellipsisVertical } from "ionicons/icons";

interface EditProfileProps {
  editProfileRef: any;
  currProfileImage: string;
  setProfileImageUri: React.Dispatch<SetStateAction<string>>;
}

const Profile = ({
  editProfileRef,
  currProfileImage,
  setProfileImageUri,
}: EditProfileProps) => {
  const [choices, setChoices] = useState({
    posts: 1,
    replies: 0,
    likes: 0,
    categories: 0,
  });

  const [toggle, setToggle] = useState(true);
  const { getMyPosts } = useContext(MyContext);
  const { myPosts } = useContext(MyContext);
  const { myInfo } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState<any>(null);

  // useEffect(() => {
  //   if (profileImage) {
  //     uploadProfileImage(profileImage)
  //   }
  // }, [profileImage])

  const profileImageUri = useMemo(() => {
    if (myInfo?.id) {
      return `${import.meta.env.VITE_APP_SUPABASE_URL}/storage/v1/object/public/ProfilePhotos/${myInfo.id}.jpg`;
    }
  }, [myInfo?.id]);

  // async function uploadProfileImage(imageUri: string) {
  //   try {
  //     const response = await fetch(imageUri);
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch the image");
  //     }
  //     const blob = await response.blob();
  //     const formData = new FormData();
  //     formData.append("image", new File([blob], `${myInfo.id}.jpg`, { type: "image/jpeg" }));
  //     const uploadResponse = await fetch(`getBaseUrl()/api/supabase-s3?id=${myInfo.id}`, {
  //       method: "POST",
  //       body: formData,
  //     });
  //     if (!uploadResponse.ok) {
  //       const errorText = await uploadResponse.text();
  //       throw new Error(`Upload failed: ${errorText}`);
  //     }
  //     const result = await uploadResponse.json();
  //     console.log("Upload successful:", result);
  //     setProfileImage(
  //       `${import.meta.env.VITE_APP_SUPABASE_URL}/storage/v1/object/public/ProfilePhotos/${myInfo.id}?${Date.now()}`
  //     );
  //     setProfileImage(null);
  //   } catch (error) {
  //     console.error(
  //       "Error uploading image:",
  //       error instanceof Error ? error.message : error
  //     );
  //   }
  // }

  useIonViewWillEnter(() => {
    if (myInfo?.id) {
      getMyPosts();
      const newProfileImageUri = `${import.meta.env.VITE_APP_SUPABASE_URL}/storage/v1/object/public/ProfilePhotos/${myInfo.id}`;
      console.log(newProfileImageUri);
      setProfileImage(`${newProfileImageUri}.jpg`);
    }
  });


  const pickImage = async () => {
    try {
      const result = await Camera.getPhoto({
        quality: 0.1,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
      });

      if (result && result.webPath) {
        setProfileImage(result.webPath);
        console.log("this is the photo", result.webPath);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };


  useIonViewWillLeave(() => {
    setToggle(false);
  });

  useIonViewDidLeave(() => {
    setToggle(true);
  });

  const blurhash = myInfo?.blurhash || "U~I#+9xuRjj[_4t7aej[xvjYoej[WCWAkCoe";

  return (
    <IonPage
      style={{
        opacity: toggle ? "1" : "0",
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <div className="brownBetween" style={{ height: "130px" }}>
        <IonMenuButton
          style={{ backgroundColor: "white", marginLeft: "4px", marginTop: '12px' }}
          color={"primary"}
        />
        <div style={{ padding: "10px" }}>
          <div className="logoContainer" style={{ top: "80px" }}>
            <div
              style={{
                borderRadius: "50%",
                overflow: "hidden",
                width: "60px",
                height: "60px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IonImg
                style={{ width: "100%", height: "100%" }}
                src="/alienLogo.svg"
              />
            </div>
          </div>
          <IonIcon
            color="light"
            style={{ paddingTop: "10px" }}
            size="large"
            onClick={() => {
              pickImage();
            }}
            icon={ellipsisVertical}
          ></IonIcon>
        </div>
      </div>
      <IonContent>
        <IonCard style={{ boxShadow: "none" }} className="noMargin">
          <div className="rowEven">
            {!myInfo?.id ? (
              <img
                className="profilePic"
                src={"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAlQMBIgACEQEDEQH/xAAaAAEBAAMBAQAAAAAAAAAAAAAAAwECBAUH/8QAKxABAAICAAQEBgIDAAAAAAAAAAECAxEEEiFRMUFhgRQiMlJxkUKhEzOS/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD7iAAAAAAAAAAAAAAAAAAAAAAAAAANbXiPWU5yT+AWEOae8m57guIRe0ebeMneAUGImJ8JZAAAAAAAAAAASveZ6R4GS2+keDQAAAAAACJ1PRal4np5ogOga0tzQ2AAAAAAAa3nUNkcs/N+AagANb2ild28Gzj4m/Nk5fKvQC/E3mfl+WP7a/5sn3ymKjqxcRzTFb6j1dDzXbw1+bH1ncx0RVQAZrOpXc61J3UGwAAAAACFvqldC31SDAADgy/7b/l3uLia8uWZ8rdQSAVB08H4X9nM7OFrrHMz5gsAiimLzTb4vGQVAAAAAARv9UrJ5Y8wTAAa5KRkrqfaexa1aRu06hG3FR/Gsz+ZBK+DJSfDcd4T5LT/ABn9L/FW+yP2fFW+yP2Bi4edxOSOnZ1OX4q32R+1MfEUt9XyyCwACuKOiXovWNRoGQAAAAAGJjcaZAQmNTpraYrWbT4RG1715o9XHxm644ifOQcuS85Lbn2js1BUAAAAdHDZZ3GO07jydTzonUxMPSpXm12RW2OvXcqsRGoZAAAAAAAAATzYa5a6t7T2UAeZl4bJj665q94Qe0nfDjv9VI33B5I9CeCxzO4m0e7HwNPuv/SjgZrWbTqsTM+j0a8HijxiZ/MrVrWsarWIj0hBx4OC3qc3/MO2IiI1DIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z"}
                alt="User icon"
                aria-placeholder={blurhash}
              />
            ) : (
              <img
                className="profilePic"
                src={
                  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAlQMBIgACEQEDEQH/xAAaAAEBAAMBAQAAAAAAAAAAAAAAAwECBAUH/8QAKxABAAICAAQEBgIDAAAAAAAAAAECAxEEEiFRMUFhgRQiMlJxkUKhEzOS/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD7iAAAAAAAAAAAAAAAAAAAAAAAAAANbXiPWU5yT+AWEOae8m57guIRe0ebeMneAUGImJ8JZAAAAAAAAAAASveZ6R4GS2+keDQAAAAAACJ1PRal4np5ogOga0tzQ2AAAAAAAa3nUNkcs/N+AagANb2ild28Gzj4m/Nk5fKvQC/E3mfl+WP7a/5sn3ymKjqxcRzTFb6j1dDzXbw1+bH1ncx0RVQAZrOpXc61J3UGwAAAAACFvqldC31SDAADgy/7b/l3uLia8uWZ8rdQSAVB08H4X9nM7OFrrHMz5gsAiimLzTb4vGQVAAAAAARv9UrJ5Y8wTAAa5KRkrqfaexa1aRu06hG3FR/Gsz+ZBK+DJSfDcd4T5LT/ABn9L/FW+yP2fFW+yP2Bi4edxOSOnZ1OX4q32R+1MfEUt9XyyCwACuKOiXovWNRoGQAAAAAGJjcaZAQmNTpraYrWbT4RG1715o9XHxm644ifOQcuS85Lbn2js1BUAAAAdHDZZ3GO07jydTzonUxMPSpXm12RW2OvXcqsRGoZAAAAAAAAATzYa5a6t7T2UAeZl4bJj665q94Qe0nfDjv9VI33B5I9CeCxzO4m0e7HwNPuv/SjgZrWbTqsTM+j0a8HijxiZ/MrVrWsarWIj0hBx4OC3qc3/MO2IiI1DIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z"
                }
                alt="User icon"
                aria-placeholder={blurhash}
              />
            )}
            {/* <IonImg aria-placeholder={blurhash} src={profileImage} className="profilePic"  /> */}
            <div className="rowClose">
              <div style={{ fontSize: "14px" }}>Posts</div>
              <div className="centerSmall">{myPosts?.length}</div>
            </div>
            <div className="rowClose">
              <div style={{ fontSize: "14px" }}>Following</div>
              <div className="centerSmall">{myInfo?.following?.length}</div>
            </div>
            <div className="rowClose">
              <div style={{ fontSize: "14px" }}>Followers</div>
              <div className="centerSmall">{myInfo?.followers?.length}</div>
            </div>
          </div>
          <div className="paddingCenter">
            <div
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "black",
                paddingTop: "10px",
              }}
            >
              {myInfo?.username}
            </div>
          </div>
          <IonCardHeader>
            {/* <IonNavLink routerDirection="forward" component={() => <Page />}>
            <div>edit profile</div>
          </IonNavLink> */}
          </IonCardHeader>
          <IonCardContent>{myInfo?.bio}</IonCardContent>
          <div className="indicator-bar-profile">
            <div
              className={`indicator-item-profile ${choices.posts ? "active" : ""}`}
              onClick={() => {
                setChoices({
                  posts: 1,
                  replies: 0,
                  likes: 0,
                  categories: 0,
                });
              }}
            >
              My Posts
            </div>
            <div
              className={`indicator-item-profile ${choices.replies ? "active" : ""}`}
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
              className={`indicator-item-profile ${choices.likes ? "active" : ""}`}
              onClick={() => {
                setChoices({
                  posts: 0,
                  replies: 0,
                  likes: 1,
                  categories: 0,
                });
              }}
            >
              Bookmarks
            </div>
          </div>
        </IonCard>
        {choices.replies ? (
          <>
            <UserComments />
          </>
        ) : choices.posts ? (
          <>
            <MyPosts />
          </>
        ) : choices.likes ? (
          <Bookmarks />
        ) : choices.categories ? (
          <>
            <Category />
          </>
        ) : (
          // <MyPosts></MyPosts>
          <></>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Profile;
