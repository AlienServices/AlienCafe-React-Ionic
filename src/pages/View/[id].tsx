import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import {
  arrowBackOutline,
  chatbubbleOutline,
  heartCircle,
  bookmarkOutline,
  shareOutline,
} from "ionicons/icons";
import "react-quill/dist/quill.snow.css";
import {
  IonButton,
  IonTextarea,
  IonAvatar,
  IonIcon,
  IonCard,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRouterLink,
  IonToolbar,
} from "@ionic/react";
import { post } from "../../utils/fetch";
import "../../theme/id.module.css";

const Post = () => {
  const [content, setContent] = useState([]);
  const [comments, setComments] = useState<string[]>([]);
  const [comment, setComment] = useState<string>("");
  const [value, setValue] = useState("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    getOnePost();
  }, []);

  const getOnePost = async () => {
    try {
      const result = await fetch(`http://localhost:3000/api/getPost?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const post = await result.json();
      setContent(post.Hello);
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  // const updatePost = async (comments: string[]) => {
  //   const updatedPost = await post({
  //     url: `http://localhost:3000/api/addLike?id=${id}`,
  //     body: {
  //       comments: comments,
  //     },
  //   });
  //   setContent(
  //     content.map((post) =>
  //       post.id === updatedPost.update.id ? updatedPost.update : post
  //     )
  //   );
  // };

  const handleOptionChange = (e: any) => {
    setSelectedOption(e.target.value);
  };

  const transformTitleToH1 = (title: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(title, "text/html");
    const pTag = doc.querySelector("p");

    if (pTag) {
      const h1Tag = document.createElement("h1");
      h1Tag.innerHTML = pTag.innerHTML;
      pTag.parentNode?.replaceChild(h1Tag, pTag);
    }

    return doc.body.innerHTML;
  };

  return (
    <IonPage>
      <IonContent>
        <IonHeader>
          <IonToolbar>
            <IonRouterLink href={`/tab1`}>
              <IonIcon size="large" icon={arrowBackOutline}></IonIcon>
            </IonRouterLink>
          </IonToolbar>
        </IonHeader>
        {content.map((post: any, index: number) => {
          const transformedTitle = transformTitleToH1(post.title);
          return (
            <div className="shadow" key={index}>
              <IonCard
                style={{
                  marginBottom: "25px",
                }}
                className="card"
              >
                <div className="around">
                  <div style={{ padding: "8px" }} className="emailContainer">
                    <IonAvatar
                      style={{
                        height: "20px",
                        width: "20px",
                        marginLeft: "10px",
                        marginRight: "5px",
                      }}
                    >
                      <img
                        alt="Silhouette of a person's head"
                        src="https://ionicframework.com/docs/img/demos/avatar.svg"
                      />
                    </IonAvatar>
                    <div className="username">{post?.email}</div>
                  </div>
                </div>
                <ReactQuill
                  style={{ color: "black" }}
                  readOnly={true}
                  theme="bubble"
                  value={transformedTitle}
                />
                <ReactQuill
                  className="small"
                  style={{ color: "black" }}
                  readOnly={true}
                  theme="bubble"
                  value={post?.content}
                />
                <div className="around">
                  <div className="flex">
                    <div className="center">
                      <IonIcon
                        color="danger"
                        size="small"
                        icon={heartCircle}
                      ></IonIcon>
                      <div>{post?.likes.length}</div>
                    </div>
                    <div className="center">
                      <IonIcon
                        size="small"
                        icon={chatbubbleOutline}
                      ></IonIcon>
                      <div>{post?.comments.length}</div>
                    </div>
                    <div className="center">
                      <IonIcon
                        size="small"
                        icon={bookmarkOutline}
                      ></IonIcon>
                    </div>
                  </div>
                  <div className="centerColumn">
                    <IonIcon
                      size="small"
                      icon={shareOutline}
                    ></IonIcon>
                  </div>
                </div>
              </IonCard>
            </div>
          );
        })}
        <div className="quiz">
          <div className="centerThesis">
            <div className="question">{content[0]?.thesis}</div>
          </div>
          <div className="checkSpace">
            <input
              type="radio"
              value="yes"
              checked={selectedOption === "yes"}
              onChange={handleOptionChange}
            />
            <div className="answerWidth">Yes</div>
          </div>
          <div className="checkSpace">
            <input
              type="radio"
              value="no"
              checked={selectedOption === "no"}
              onChange={handleOptionChange}
            />
            <div className="answerWidth">No</div>
          </div>
          <div className="checkSpace">
            <input
              type="radio"
              value="undecided"
              checked={selectedOption === "undecided"}
              onChange={handleOptionChange}
            />
            <div className="answerWidth">Undecided</div>
          </div>
        </div>
        <IonItem lines="none">
          <div className="column" style={{ width: "100%" }}>
            {content[0]?.comments.map((comments: any, index: number) => {
              return (
                <IonCard key={index}>
                  <IonItem lines="none">
                    <ReactQuill readOnly={true} theme="bubble" value={comments} />
                  </IonItem>
                </IonCard>
              );
            })}
          </div>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default Post;