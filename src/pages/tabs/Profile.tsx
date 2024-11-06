import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonImg,
  useIonViewWillEnter
} from "@ionic/react";
import "../../theme/Tab2.css";
import MyPosts from "../../components/MyPosts";
import Category from "../../components/Category";
import { useEffect, useState, useContext, SetStateAction, useMemo } from "react";
import { MyContext } from "../../providers/postProvider";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import UserComments from "../../components/UserComments";
import { UserContext } from "../../providers/userProvider";

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
  //     const uploadResponse = await fetch(`http://localhost:3000/api/supabase-s3?id=${myInfo.id}`, {
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
      const newProfileImageUri = `${import.meta.env.VITE_APP_SUPABASE_URL}/storage/v1/object/public/ProfilePhotos/${myInfo.id}`;
      console.log(newProfileImageUri);
      setProfileImage(`${newProfileImageUri}.jpg`);
    }
  });

  const pickImage = async () => {
    try {
      const result = await Camera.getPhoto({
        quality: .1,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
      });

      if (result && result.webPath) {
        setProfileImage(result.webPath);
        console.log('this is the photo', result.webPath)
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const blurhash = myInfo?.blurhash || 'U~I#+9xuRjj[_4t7aej[xvjYoej[WCWAkCoe'


  console.log('uri', profileImageUri)
  console.log('id', myInfo?.id)

  return (
    <IonPage>
      <div className="brown" style={{ height: '110px' }}>
        <div className="leftMiddle">
          <div className="logoContainer" style={{ top: '60px' }}>
            <IonImg style={{ width: '60px', height: '60px' }} src="/AlienCafeLogo1.png"></IonImg>
          </div>
        </div>
      </div>
      <IonContent>
        <IonCard style={{ boxShadow: 'none' }} className="noMargin">
          <div className="rowEven">
            <img
              className="profilePic"
              src={profileImageUri}
              alt="User icon"
              aria-placeholder={blurhash}
            />
            {/* <IonImg aria-placeholder={blurhash} src={profileImage} className="profilePic"  /> */}
            <div className="rowClose">
              <div style={{ fontSize: '14px' }}>Posts</div>
              <div className="centerSmall">{myPosts?.length}</div>
            </div>
            <div className="rowClose">
              <div style={{ fontSize: '14px' }}>Following</div>
              <div className="centerSmall">{myInfo?.following.length}</div>
            </div>
            <div className="rowClose">
              <div style={{ fontSize: '14px' }}>Followers</div>
              <div className="centerSmall">{myInfo?.followers.length}</div>
            </div>
          </div>
          <div className="paddingCenter">
            <div style={{ fontSize: '18px', fontWeight: '600', color: 'black', paddingTop: '10px' }}>{myInfo?.username}</div>
          </div>
          <IonCardHeader>
            {/* <IonNavLink routerDirection="forward" component={() => <Page />}>
            <div>edit profile</div>
          </IonNavLink> */}

          </IonCardHeader>
          <IonCardContent>{myInfo?.bio}</IonCardContent>
          <div className="indicator-bar-profile">
            <div
              className={
                `indicator-item-profile ${choices.posts ? "active" : ""}`
              }
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
              className={
                `indicator-item-profile ${choices.replies ? "active" : ""}`
              }
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
              className={
                `indicator-item-profile ${choices.likes ? "active" : ""}`
              }
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
              className={
                `indicator-item-profile ${choices.categories ? "active" : ""}`
              }
              onClick={() => {
                setChoices({
                  posts: 0,
                  replies: 0,
                  likes: 0,
                  categories: 1,
                });
              }}
            >
              Reposts
            </div>
          </div>
        </IonCard>
        {choices.replies ? (
          <>
            <UserComments id={myInfo.id} />
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
        <IonButton onClick={() => { pickImage() }}>Click m</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
