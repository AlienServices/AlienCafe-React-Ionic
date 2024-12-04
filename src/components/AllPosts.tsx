import { useEffect, useState, useContext } from "react";
import {
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonAvatar,
  IonContent,
  IonCard,
  IonNavLink,
  IonList,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import { useLocation, useHistory } from "react-router";
import {
  heartCircle,
  chatbubbleOutline,
  bookmarkOutline,
  shareOutline,
  checkmarkCircleOutline,
  arrowDownCircleOutline,
  arrowUpCircleOutline,
  arrowUpCircle,
  arrowDownCircle,
} from "ionicons/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { supabase } from "./supaBase";
import "../pages/Tab3.css";
import Page from "../pages/View/[id]";
import Profile from "../pages/Profile/[id]";
import { MyContext } from "../providers/postProvider";
import moment from "moment";
import { UserContext } from "../providers/userProvider";

const Content: React.FC = () => {
  const history = useHistory();
  const {
    posts,
    myPosts,
    setPosts,
    setMyPosts,
    addLike,
    getAllPosts,
    getUserPosts,
    addDislike,
    addBookmark,
  } = useContext(MyContext);
  const { myInfo, setMyInfo, updateUser } = useContext(UserContext);
  const [user, setUser] = useState({
    bio: "",
    email: "",
    followers: [],
    following: [],
    id: "",
    username: "",
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const result = await fetch(
        `http://10.1.10.233:3000/api/myInfo?email=${localStorage.getItem("user")}`,
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
    console.log("hitting logout in all posts");
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
  const gotoProfile = (id: string) => {
    history.push(`/profile/${id}`);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const isLikedByUser = (likes: string[]): boolean => {
    // Check if the likes array includes your user ID
    return likes.includes(myInfo.id);
  };

  const isDislikedByUser = (dislikes: string[]): boolean => {
    // Check if the likes array includes your user ID
    return dislikes.includes(myInfo.id);
  };

  const calculateNetScore = (likes: string[], dislikes: string[]): number => {
    return likes.length - dislikes.length;
  };

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
                const month = String(date.getUTCMonth() + 1).padStart(2, "0");
                const day = String(date.getUTCDate()).padStart(2, "0");
                const year = date.getUTCFullYear();

                const formattedDate = `${month}/${day}/${year}`;

                return (
                  <div className="shadow" key={post.id}>
                    <IonCard
                      style={{ boxShadow: "none", paddingBottom: "10px" }}
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
                            <div
                              onClick={() => {
                                gotoProfile(post?.email);
                              }}
                            >
                              <div className="username">{post.email}</div>
                            </div>
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
                      </div>
                      <div className="smallRow">
                        <div className="tinyRow">
                          <div className="voteRow">
                            <IonIcon
                              onClick={() => {
                                addLike(post.id);
                              }}
                              icon={
                                isLikedByUser(post?.likes)
                                  ? arrowUpCircle
                                  : arrowUpCircleOutline
                              }
                            ></IonIcon>
                            <div className="small">
                              {calculateNetScore(post?.likes, post?.dislikes)}
                            </div>
                            <IonIcon
                              onClick={() => {
                                addDislike(post.id);
                              }}
                              icon={
                                isDislikedByUser(post?.dislikes)
                                  ? arrowDownCircle
                                  : arrowDownCircleOutline
                              }
                            ></IonIcon>
                          </div>
                          <IonIcon
                            style={{ paddingRight: "5px" }}
                            icon={chatbubbleOutline}
                          ></IonIcon>
                          <div className="small">{post?.comments?.length}</div>
                        </div>
                        <div className="tinyRow">
                          <IonIcon
                            onClick={() => {
                              console.log("hitting add bookmark");
                              addBookmark(myInfo.id, post.id);
                            }}
                            icon={bookmarkOutline}
                          ></IonIcon>
                          <IonIcon
                            icon={shareOutline}
                            onClick={openModal}
                          ></IonIcon>{" "}
                          {/* Share button opens modal */}
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
      <IonModal isOpen={showModal}>
        <IonButton slot="end">Close</IonButton>
        <IonButton style={{ padding: "10px" }} onClick={closeModal}>
          close
        </IonButton>
        <input style={{ color: "white" }} type="text" />
        <div>kale</div>
      </IonModal>
    </IonContent>
  );
};

export default Content;
