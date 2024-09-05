import { useEffect, useState, useContext } from "react";
import { IonIcon } from "@ionic/react";
import { useParams } from "react-router-dom";
import { useLocation, useHistory } from "react-router";
import {
  heartCircle,
  chatbubbleOutline,
  bookmarkOutline,
  shareOutline,
  checkmarkCircleOutline,
  arrowDownCircleOutline,
  arrowDownCircle,
  arrowUpCircleOutline,
  arrowUpCircle,
  bookmark,


} from "ionicons/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { supabase } from "./supaBase";
import {
  IonButton,
  IonAvatar,
  IonContent,
  IonCard,
  IonNavLink,
  IonList,
} from "@ionic/react";
import "../pages/Tab3.css";
import Page from "../pages/View/[id]";
import Profile from "../pages/Profile/[id]";
import { MyContext } from "../providers/postProvider";
import moment from "moment";

const Content: React.FC = () => {
  const history = useHistory();
  const {
    posts,
    myPosts,
    setPosts,
    setMyPosts,
    updatePost,
    getAllPosts,
    myInfo,
    updateUser,
    getUserPosts,
  } = useContext(MyContext);
  const [user, setUser] = useState<{
    bio: string;
    email: string;
    followers: string[];
    following: string[];
    id: string;
    username: string;
  }>({
    bio: "",
    email: "",
    followers: [],
    following: [],
    id: "",
    username: "",
  });

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const result = await fetch(
        `http://localhost:3000/api/myInfo?email=${localStorage.getItem("user")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const userInfo = await result.json();
      setUser(userInfo.Hello);
      console.log(userInfo, "this is user result");
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      console.log("You Logged Out");
      if (error) {
        console.log("this is logout error", error);
      }
    } catch (error) {
      console.log(error);
    }
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

  const truncateContent = (content: string, length: number) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    let text = doc.body.textContent || "";
    return (
      text.split(" ").slice(0, 20).join(" ") +
      (text.split(" ").length > 20 ? "..." : "")
    );
  };

  const gotoTopic = (id: string) => {
    history.push(`/view/${id}`);
  };

  console.log(posts);

  return (
    <IonContent className="page">
      <IonList>
        {posts ? (
          <>
            {posts
              .sort((a, b) => Date.parse(b?.date) - Date.parse(a?.date))
              .map((post: any, index: number) => {
                const transformedTitle = transformTitleToH1(post.title);
                const truncatedContent = truncateContent(post.content, 400);

                const date = new Date(post.date);
                const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
                const day = String(date.getUTCDate()).padStart(2, "0");
                const year = date.getUTCFullYear();

                // Format the date as mm/dd/yyyy
                const formattedDate = `${month}/${day}/${year}`;

                return (
                  <div className="shadow" key={post.id}>
                    <IonCard
                      style={{
                        boxShadow: "none",
                        paddingBottom: "10px",
                      }}
                      className="card"
                    >
                      <div className="space">
                        <div className="around">
                          <div className="emailContainer">
                            <IonAvatar
                              style={{
                                height: "20px",
                                width: "20px",
                                marginLeft: "3px",

                              }}
                            >
                              <img
                                alt="Silhouette of a person's head"
                                src="https://ionicframework.com/docs/img/demos/avatar.svg"
                              />
                            </IonAvatar>
                            <IonNavLink
                              onClick={() => {
                                getUserPosts(post.email);
                              }}
                              routerDirection="forward"
                              component={() => <Profile id={post.email} />}
                            >
                              <div className="username">{post.email}</div>
                            </IonNavLink>
                            {/* <div style={{ fontSize: "13px" }}>
                              {formattedDate}
                            </div> */}
                          </div>
                          <div>
                            {myInfo?.email !== post?.email ? (
                              <>
                                {myInfo?.following?.indexOf(post.email) !==
                                  -1 ? (
                                  <div>
                                    <IonIcon
                                      icon={checkmarkCircleOutline}
                                    ></IonIcon>
                                  </div>
                                ) : (
                                  <div>
                                    <button
                                      className="button"
                                      onClick={() => {
                                        updateUser(
                                          myInfo.email,
                                          post?.email,
                                          "",
                                        );
                                      }}
                                      size="small"
                                    >
                                      Follow
                                    </button>
                                  </div>
                                )}
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            gotoTopic(post.id);
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
                          <div style={{ alignItems: 'center' }} className="flex">
                            <IonIcon
                              size="large"
                              icon={heartCircle}
                            ></IonIcon>

                            <div className="center">
                              <IonIcon
                                color=""
                                size="large"
                                icon={bookmarkOutline}
                              ></IonIcon>
                            </div>
                          </div>
                          <div style={{ alignItems: 'center' }} className="flex">
                            <IonIcon
                              color=""
                              size="small"
                              icon={shareOutline}
                            ></IonIcon>
                          </div>
                        </div> */}
                      </div>
                      <div className="smallRow">
                        <div className="tinyRow">
                          <div className="voteRow">
                            <IonIcon icon={arrowUpCircleOutline}></IonIcon>
                            <IonIcon icon={arrowDownCircleOutline}></IonIcon>
                          </div>
                          <IonIcon icon={chatbubbleOutline}></IonIcon>
                        </div>
                        <div className="tinyRow">
                          <IonIcon icon={bookmarkOutline}></IonIcon>
                          <IonIcon icon={shareOutline}></IonIcon>
                        </div>
                      </div>
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
