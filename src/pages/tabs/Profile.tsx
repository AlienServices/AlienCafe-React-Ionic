import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonImg,
  useIonViewWillEnter,
  IonIcon,
  IonMenuButton,
  useIonViewDidLeave,
  useIonViewWillLeave,
} from "@ionic/react";
import "../../theme/Tab2.css";
import MyPosts from "../../components/MyPosts";
import Category from "../../components/Category";
import {
  useEffect,
  useState,
  useContext,
  SetStateAction,
  useMemo,
} from "react";
import { MyContext } from "../../providers/postProvider";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import UserComments from "../../components/UserComments";
import { UserContext } from "../../providers/userProvider";
import { ellipsisVertical, ellipsisVerticalOutline } from "ionicons/icons";

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
    console.log("Cleaning up resources...");
    setToggle(false);
  });

  useIonViewDidLeave(() => {
    console.log("Cleaning up resources...");
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
                src={profileImageUri}
                alt="User icon"
                aria-placeholder={blurhash}
              />
            ) : (
              <img
                className="profilePic"
                src={
                  "data:image/jpeg;base64,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"
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
              Likes
            </div>
          </div>
        </IonCard>
        {choices.replies ? (
          <>
            <UserComments id={myInfo?.id || ""} />
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
      </IonContent>
    </IonPage>
  );
};

export default Profile;
