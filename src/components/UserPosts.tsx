import {  useContext } from "react";
// import Editor from '../components/Editor';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  IonButton,
  IonAvatar,
  IonContent,
  IonCard,
  IonList,  
} from "@ionic/react";
import "../theme/Tab3.css"
import { MyContext } from "../providers/postProvider";

const Content: React.FC = () => {
  const { deletePost, userPosts } = useContext<any>(MyContext);

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

  const truncateContent = (content: string, length: number) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    let textContent = doc.body.textContent || "";
    if (textContent.length > length) {
      textContent = textContent.substring(0, length) + "...";
    }
    return textContent;
  };

  


  return (
    <IonContent className="page">
      <IonList>
        {userPosts ? (
          <>            
            {userPosts
              ?.sort((a: any, b: any) => Date.parse(b?.date) - Date.parse(a?.date))
              .map((post: any, index: number) => {
                var parser = new DOMParser();
                var doc = parser.parseFromString(post.content, "text/html");
                var output = Array.prototype.slice
                  .call(doc.querySelectorAll("h1"))
                  .map((el) => el.outerHTML);
                const transformedTitle = transformTitleToH1(post.title);
                const truncatedContent = truncateContent(post.content, 200);
                const date = new Date(post.date);
                const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
                const day = String(date.getUTCDate()).padStart(2, "0");
                const year = date.getUTCFullYear();

                // Format the date as mm/dd/yyyy
                const formattedDate = `${month}/${year}`;
                return (
                  <div className="shadow">
                    <IonCard
                      style={{
                        boxShadow: "none",
                        borderRadius: "0px",
                        borderBottom: "1px solid #eaeaea",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                      }}
                      key={index}
                      className="card"
                    >
                      <div className="around">
                        <div className="emailContainer">
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
                          <div className="username">{post.email}</div>
                        </div>
                        <IonButton
                          onClick={() => {
                            deletePost(post.id);
                          }}
                        >
                          Trash
                        </IonButton>
                      </div>
                      <div
                        onClick={() => {
                          // gotoTopic(post.id);
                        }}
                      >
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
                          value={truncatedContent}
                        />
                      </div>
                      {/* <div className="around">
                        <div className="flex">
                          <div
                            className="center"
                            onClick={() => {
                              if (post.likes.indexOf(userEmail) === -1) {
                                let fullLikes = [...post.likes, userEmail];
                                updatePost({
                                  id: post.id,
                                  likes: fullLikes,
                                  content: post.content,
                                  email: post.email,
                                });
                              } else {
                                let emailIndex = post.likes.indexOf(
                                  localStorage.getItem("user") || "",
                                );
                                let newLikes = post.likes.toSpliced(
                                  emailIndex,
                                  1,
                                );
                                console.log(newLikes, "thse are new likes");
                                updatePost({
                                  id: post.id,
                                  likes: newLikes,
                                  content: post.content,
                                  email: post.email,
                                });
                              }
                            }}
                          >
                            <IonIcon
                              color="danger"
                              size="small"
                              icon={heartCircle}
                            ></IonIcon>
                            <div>{post.likes.length}</div>
                          </div>
                          <div className="center">
                            <IonIcon
                              color=""
                              size="small"
                              icon={chatbubbleOutline}
                            ></IonIcon>
                            <div>{post.comments.length}</div>
                          </div>
                          <div className="center">
                            <IonIcon
                              color=""
                              size="small"
                              icon={bookmarkOutline}
                            ></IonIcon>
                          </div>
                        </div>
                        <div className="flexSmall">
                          <div>{formattedDate}</div>
                          <IonIcon
                            color=""
                            size="small"
                            icon={shareOutline}
                          ></IonIcon>
                        </div>
                      </div> */}
                    </IonCard>
                  </div>
                );
              })}
          </>
        ) : (
          <>
            <div>You aint got no post</div>
          </>
        )}
      </IonList>
    </IonContent>
  );
};

export default Content;
