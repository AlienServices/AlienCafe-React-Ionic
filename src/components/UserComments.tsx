import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { IonCard, IonItem, IonList } from "@ionic/react";
import "../theme/Tab3.css";


const UserComments = ({ id }: { id: string }) => {
  
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getUserComments();
  }, []);

  const getUserComments = async () => {
    try {
      const result = await fetch(
        `http://10.1.10.233:3000/api/users/getUserComments?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const post = await result.json();
      setComments(post.comment);
      console.log(post);
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  return (
    <>
      <IonList>
        {comments?.map((comment: any) => {
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
          );
        })}
      </IonList>
    </>
  );
};

export default UserComments;
