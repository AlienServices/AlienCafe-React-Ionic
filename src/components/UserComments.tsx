import { useContext, useEffect, useState } from "react";
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

  return (
    <div style={{ paddingTop: '20px' }}>
      <IonList>
        {loading ? <div style={{ display: "flex", justifyContent: 'center', alignItems: "center", margin: '20px' }}><IonSpinner></IonSpinner></div> : <>{comments?.map((comment: any) => {
          return (
            <IonItem lines="none">
              <img
                style={{ width: '50px' }}
                alt="Silhouette of a person's head"
                src={"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAlQMBIgACEQEDEQH/xAAaAAEBAAMBAQAAAAAAAAAAAAAAAwECBAUH/8QAKxABAAICAAQEBgIDAAAAAAAAAAECAxEEEiFRMUFhgRQiMlJxkUKhEzOS/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD7iAAAAAAAAAAAAAAAAAAAAAAAAAANbXiPWU5yT+AWEOae8m57guIRe0ebeMneAUGImJ8JZAAAAAAAAAAASveZ6R4GS2+keDQAAAAAACJ1PRal4np5ogOga0tzQ2AAAAAAAa3nUNkcs/N+AagANb2ild28Gzj4m/Nk5fKvQC/E3mfl+WP7a/5sn3ymKjqxcRzTFb6j1dDzXbw1+bH1ncx0RVQAZrOpXc61J3UGwAAAAACFvqldC31SDAADgy/7b/l3uLia8uWZ8rdQSAVB08H4X9nM7OFrrHMz5gsAiimLzTb4vGQVAAAAAARv9UrJ5Y8wTAAa5KRkrqfaexa1aRu06hG3FR/Gsz+ZBK+DJSfDcd4T5LT/ABn9L/FW+yP2fFW+yP2Bi4edxOSOnZ1OX4q32R+1MfEUt9XyyCwACuKOiXovWNRoGQAAAAAGJjcaZAQmNTpraYrWbT4RG1715o9XHxm644ifOQcuS85Lbn2js1BUAAAAdHDZZ3GO07jydTzonUxMPSpXm12RW2OvXcqsRGoZAAAAAAAAATzYa5a6t7T2UAeZl4bJj665q94Qe0nfDjv9VI33B5I9CeCxzO4m0e7HwNPuv/SjgZrWbTqsTM+j0a8HijxiZ/MrVrWsarWIj0hBx4OC3qc3/MO2IiI1DIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z"}
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
