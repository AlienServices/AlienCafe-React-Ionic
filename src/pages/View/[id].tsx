import { useEffect, useState, useRef, useCallback } from "react";
// import { useApi } from '../hooks/useApi';
// import Editor from '../components/Editor';
import { useParams, withRouter } from "react-router-dom";
import ReactQuill from "react-quill";
import {
  colorFill,
  heart,
  heartCircle,
  chatbubbleOutline,
  bookmarkOutline,
  shareOutline,
  arrowBackOutline,
  backspaceOutline,
} from "ionicons/icons";
import { RouteComponentProps } from "react-router";
import "react-quill/dist/quill.snow.css";
import alien from '../../../public/alien.png'
import Quill from "quill/core";
import {
  IonButton,
  IonTextarea,
  IonAvatar,
  IonButtons,
  IonImg,
  IonBackButton,
  IonCard,
  IonText,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
  IonIcon,
  IonRouterLink,
  useIonLoading,
} from "@ionic/react";
import { post } from "../../utils/fetch";
import Editor from "../../components/Editor";
import "../../theme/id.module.css";

const Post = () => {
  const [content, setContent] = useState<
    {
      id: string;
      content: string;
      likes: string;
      email: string;
      comments: string[];
    }[]
  >([]);
  const [array, setArray] = useState<[]>([]);
  const [comments, setComments] = useState<string[]>([]);
  const [comment, setComment] = useState<string>("");
  const [written, setWritten] = useState("");
  const [value, setValue] = useState("");
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
      console.log(post.Hello, "this is post");
      setContent(post.Hello);
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  const updatePost = async (comments: string[]) => {
    const updatedPost = await post({
      url: `http://localhost:3000/api/addLike?id=${id}`,
      body: {
        comments: comments,
      },
    });
    console.log(updatedPost, "an updated post");
    setContent(
      content.map((post) =>
        post.id === updatedPost.update.id ? updatedPost.update : post,
      ),
    );
  };

  // const handleKeyDown = () => {
  //     if (e.key === 'Enter') {
  //         setValue('')
  //     }
  // }

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

  console.log(id)

  return (
    <IonPage>
      <IonContent>
        <IonHeader>
          <IonToolbar>
            <IonRouterLink href={`/tab1`}>
              <IonIcon size="large" icon={arrowBackOutline}></IonIcon>
            </IonRouterLink>
            <div className="centerAlien">
              {/* <div className="imageContainer">
                <IonImg src={alien}></IonImg>
              </div> */}
            </div>
          </IonToolbar>
        </IonHeader>
        {content.map((post: any, index: number) => {
          const transformedTitle = transformTitleToH1(post.title);
          return (
            <div className="shadow">
              <IonCard

                style={{
                  marginBottom: "25px",
                }}
                key={index}
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
                  <div>{/* <IonButton size='small'>Follow</IonButton> */}</div>
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
                    <div
                      className="center"
                      onClick={() => {
                        // if (post.likes.indexOf(userEmail) === -1) {
                        //     let fullLikes = [...post.likes, userEmail];
                        //     updatePost({ id: post.id, likes: fullLikes, content: post.content, email: post.email })
                        // } else {
                        //     let emailIndex = post.likes.indexOf(localStorage.getItem('user') || '')
                        //     let newLikes = post.likes.toSpliced(emailIndex, 1)
                        //     console.log(newLikes, 'thse are new likes')
                        //     updatePost({ id: post.id, likes: newLikes, content: post.content, email: post.email })
                        // }
                      }}
                    >
                      <IonIcon
                        color="danger"
                        size="small"
                        icon={heartCircle}
                      ></IonIcon>
                      <div>{post?.likes.length}</div>
                    </div>
                    <div className="center">
                      <IonIcon
                        color=""
                        size="small"
                        icon={chatbubbleOutline}
                      ></IonIcon>
                      <div>{post?.comments.length}</div>
                    </div>
                    <div className="center">
                      <IonIcon
                        color=""
                        size="small"
                        icon={bookmarkOutline}
                      ></IonIcon>
                    </div>
                  </div>
                  <div className="centerColumn">
                    <IonIcon
                      color=""
                      size="small"
                      icon={shareOutline}
                    ></IonIcon>
                  </div>
                </div>
              </IonCard>
            </div>
          );
        })}
        <IonItem lines="none">
          <div className="column" style={{ width: "100%" }}>
            {content[0]?.comments.map((comments: any, index: number) => {
              return (
                <IonCard>
                  <IonItem lines="none">
                    <ReactQuill
                      readOnly={true}
                      theme="bubble"
                      value={comments}
                    />
                  </IonItem>
                  {/* <IonButton
                    onClick={(e) => {
                      let newComments = content[0]?.comments.toSpliced(
                        index,
                        1,
                      );
                      console.log(
                        newComments,
                        index,
                        "this is the index and spliced array",
                      );
                      updatePost(newComments);
                    }}
                  >
                    delete me
                  </IonButton> */}
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

//  <div className="flexWide">
//            <Editor toolBar={false} theme={'snow'} value={value} setValue={setValue} 
//           <IonItem>
//             <IonTextarea
//               value={value}
//               onIonInput={(e: any) => {
//                 setValue(e.target.value);
//               }}
//             ></IonTextarea>
//           </IonItem>
//           <div>
//             <IonButton
//               size="small"
//               onClick={(e) => {
//                 setValue("");
//                 updatePost([...content[0].comments, value]);
//                 getOnePost();
//                 handleKeyDown(e, [...content[0].comments, value])
//               }}
//             >
//               Add Comment
//             </IonButton>
//           </div>
//         </div> 