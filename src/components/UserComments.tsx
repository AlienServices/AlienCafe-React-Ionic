import { useContext, useEffect, useMemo, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { IonCard, IonItem, IonList, useIonViewDidEnter, useIonViewWillEnter, IonSpinner } from "@ionic/react";
import "../theme/Tab3.css";
import { MyContext } from "../providers/postProvider";
import { UserContext } from "../providers/userProvider";


const UserComments = () => {
  const { getBaseUrl } = useContext(MyContext)
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { myInfo, setMyInfo } = useContext(UserContext);

  useEffect(() => {
    if (myInfo) {
      getUserComments();
    } else {
      setLoading(false)
    }
  }, []);

  const getUserComments = async () => {
    try {
      const result = await fetch(
        `${getBaseUrl()}/api/comments/getUserComments?id=${myInfo?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const post = await result.json();
      setLoading(false)
      setComments([post.comments]);
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  function formatRelativeDate(isoDateString: string) {
    const date = new Date(isoDateString);
    const now = new Date();

    const timeDiff = now - date;
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (minutesDiff < 60) {
      return `${minutesDiff} minutes ago`;
    } else if (hoursDiff < 24) {
      return `${hoursDiff} hours ago`;
    } else if (daysDiff === 1) {

      return "1 day ago";
    } else if (daysDiff === 2) {
      // Exactly 2 days ago
      return "2 days ago";
    } else {
      // More than 2 days ago, show Month Day format
      const options = { month: "numeric", day: "numeric", year: '2-digit' };
      return date.toLocaleDateString("en-US", options);
    }
  }

  // function convertUTCToLocal(utcDateString: any) {
  //   const utcDate = new Date(utcDateString);
  //   const month = String(utcDate.getUTCMonth() + 1).padStart(2, "0");
  //   const day = String(utcDate.getUTCDate()).padStart(2, "0");
  //   const year = utcDate.getUTCFullYear();

  //   // Format the date as mm/dd/yyyy
  //   const formattedDate = `${month}/${year}`;

  //   return formattedDate;
  // }

  const profileImageUri = useMemo(() => {
    if (myInfo?.id) {
      return `${import.meta.env.VITE_APP_SUPABASE_URL}/storage/v1/object/public/ProfilePhotos/${myInfo.id}.jpg`;
    }
  }, [myInfo?.id]);


  return (
    <div style={{ paddingTop: '20px' }}>
      <IonList>
        {loading ? <div style={{ display: "flex", justifyContent: 'center', alignItems: "center", margin: '20px' }}><IonSpinner></IonSpinner></div> : <>{comments?.map((comment: any) => {
          return (
            <IonItem lines="none">
              <img
                style={{ width: '30px', borderRadius: '20px', height: '30px' }}
                alt="Silhouette of a person's head"
                src={`${profileImageUri}`}
              />
              <IonCard className="cardComment">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="userName">{comment.username}</div>
                    <div style={{ fontSize: '10px' }}>{formatRelativeDate(comment.date)}</div>
                  </div>
                  <div className="comment">{comment.comment}</div>
                </div>
              </IonCard>
            </IonItem>
          );
        })}</>
        }

      </IonList>
    </div>
  );
};

export default UserComments;
