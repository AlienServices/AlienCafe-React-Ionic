import React, { useState, useContext } from "react";
import {
  IonIcon,
  IonModal,
  IonAvatar,
  IonCard,
  IonNavLink,
  IonList,
  IonButton,
} from "@ionic/react";
import {
  arrowUpCircleOutline,
  arrowUpCircle,
  arrowDownCircleOutline,
  arrowDownCircle,
  chatbubbleOutline,
  bookmarkOutline,
  shareOutline,
  checkmarkCircleOutline,
} from "ionicons/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../theme/Tab3.css";
import Profile from "../../pages/Profile/[id]";
import { MyContext } from "../../providers/postProvider";
import { UserContext } from "../../providers/userProvider";
import { useHistory } from "react-router";

interface PostProps {
  post: {
    id: string;
    email: string;
    title: string;
    links: string,
    content: string;
    likes: string[];
    dislikes: string[];
    comments: any[];
    userId: string
  };
  setToggle: (value: boolean) => void;
}

const Post: React.FC<PostProps> = ({ post, setToggle }) => {
  const history = useHistory();
  const { addLike, addDislike, getUserPosts } = useContext(MyContext);
  const { myInfo, updateUser } = useContext<any>(UserContext);
  const [showModal, setShowModal] = useState(false);

  const transformTitleToH1 = (title: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(title, "text/html");
    const pTag = doc.querySelector("p");

    if (pTag) {
      const h1Tag = document.createElement("h1");
      h1Tag.innerHTML = pTag.innerHTML;
      h1Tag.classList.add("quillH1");
      pTag.parentNode?.replaceChild(h1Tag, pTag);
    }

    return doc.body.innerHTML;
  };

  const truncateContent = (content: string, length: number = 170) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    let text = doc.body.textContent || "";
    return text.length > length ? text.slice(0, length) + "..." : text;
  };

  const gotoTopic = (id: string) => {
    setToggle(false);
    history.push(`/view/${id}`);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const isLikedByUser = (likes: string[]): boolean =>
    likes.includes(myInfo?.id ?? "");
  const isDislikedByUser = (dislikes: string[]): boolean =>
    dislikes.includes(myInfo?.id ?? "");
  const calculateNetScore = (likes: string[], dislikes: string[]): number =>
    likes.length - dislikes.length;

  const transformedTitle = transformTitleToH1(post.title);
  const truncatedContent = truncateContent(post.content, 400);
  const truncatedLinks = truncateContent(post.links, 400);

  const profileImage = (id: string) => {
    if (id) {
      const newProfileImageUri = `${import.meta.env.VITE_APP_SUPABASE_URL
        }/storage/v1/object/public/ProfilePhotos/${id}.jpg`;
      return newProfileImageUri;
    }
  };

  console.log(truncatedLinks, 'these are those links')

  return (
    <div style={{ minHeight: "200px" }}>
      <IonList>
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
                      height: "35px",
                      width: "35px",
                    }}
                  >
                    <img
                      alt="Silhouette of a person's head"
                      src={"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAlQMBIgACEQEDEQH/xAAaAAEBAAMBAQAAAAAAAAAAAAAAAwECBAUH/8QAKxABAAICAAQEBgIDAAAAAAAAAAECAxEEEiFRMUFhgRQiMlJxkUKhEzOS/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD7iAAAAAAAAAAAAAAAAAAAAAAAAAANbXiPWU5yT+AWEOae8m57guIRe0ebeMneAUGImJ8JZAAAAAAAAAAASveZ6R4GS2+keDQAAAAAACJ1PRal4np5ogOga0tzQ2AAAAAAAa3nUNkcs/N+AagANb2ild28Gzj4m/Nk5fKvQC/E3mfl+WP7a/5sn3ymKjqxcRzTFb6j1dDzXbw1+bH1ncx0RVQAZrOpXc61J3UGwAAAAACFvqldC31SDAADgy/7b/l3uLia8uWZ8rdQSAVB08H4X9nM7OFrrHMz5gsAiimLzTb4vGQVAAAAAARv9UrJ5Y8wTAAa5KRkrqfaexa1aRu06hG3FR/Gsz+ZBK+DJSfDcd4T5LT/ABn9L/FW+yP2fFW+yP2Bi4edxOSOnZ1OX4q32R+1MfEUt9XyyCwACuKOiXovWNRoGQAAAAAGJjcaZAQmNTpraYrWbT4RG1715o9XHxm644ifOQcuS85Lbn2js1BUAAAAdHDZZ3GO07jydTzonUxMPSpXm12RW2OvXcqsRGoZAAAAAAAAATzYa5a6t7T2UAeZl4bJj665q94Qe0nfDjv9VI33B5I9CeCxzO4m0e7HwNPuv/SjgZrWbTqsTM+j0a8HijxiZ/MrVrWsarWIj0hBx4OC3qc3/MO2IiI1DIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z"}
                    />
                  </IonAvatar>
                  <IonNavLink
                    onClick={() => {
                      getUserPosts(post.email);
                    }}
                    routerDirection="forward"
                    component={() => <Profile id={post.email} />}
                  >
                    <div className="usernameColumn">
                      <div className="username">{post.email}</div>
                      <div className="tag">{post.email}</div>
                    </div>
                  </IonNavLink>
                </div>
                <div>
                  {myInfo?.email !== post?.email ? (
                    <>
                      {myInfo?.following?.indexOf(post?.email) !== -1 ? (
                        <IonIcon icon={checkmarkCircleOutline}></IonIcon>
                      ) : (
                        <button
                          className="button"
                          onClick={() => {
                            updateUser(myInfo?.email, post?.email, "");
                          }}
                        >
                          Follow
                        </button>
                      )}
                    </>
                  ) : null}
                </div>
              </div>
              <div onClick={() => gotoTopic(post.id)}>
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
                    onClick={() => addLike(post.id)}
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
                    onClick={() => addDislike(post.id)}
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
                <IonIcon icon={bookmarkOutline}></IonIcon>
                <IonIcon icon={shareOutline} onClick={openModal}></IonIcon>
              </div>
            </div>
          </IonCard>
        </div>
      </IonList>

      <IonModal isOpen={showModal}>
        <IonButton slot="end">Close</IonButton>
        <IonButton style={{ padding: "10px" }} onClick={closeModal}>
          close
        </IonButton>
        <input style={{ color: "white" }} type="text" />
        <div>kale</div>
      </IonModal>
    </div>
  );
};

export default Post;
