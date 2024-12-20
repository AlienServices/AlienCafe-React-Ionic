import { useState, useEffect, useContext, useRef } from "react";
import {
  IonCard,
  IonIcon,
  IonSkeletonText,
  IonLabel,
  IonList,
  IonItem,
  IonToast,
} from "@ionic/react";
import { sendOutline, trashBin } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import {
  arrowDownCircleOutline,
  arrowUpCircleOutline,
  arrowUpCircle,
  arrowDownCircle,
} from "ionicons/icons";
import Comment from "../pages/Comment/[id]";
import { UserContext } from "../providers/userProvider";
import { MyContext } from "../providers/postProvider";

interface Comment {
  id: string;
  parentId: string | null;
  comment: string;
  username: string;
  vote: string;
  userId: string;
  likes: string[];
  dislikes: string[];
}

interface RepliesProps {
  postId: string;
  myVote: string;
}



const Replies: React.FC<RepliesProps> = ({ postId, myVote }) => {
  const { myInfo } = useContext(UserContext);
  const { getBaseUrl } = useContext(MyContext);
  const [comments, setComments] = useState<Comment[]>([]);
  const history = useHistory();
  const [comment, setComment] = useState<string>("");
  const [replyComment, setReplyComment] = useState<string>("");
  const [replyCommentId, setReplyCommentId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyingToUsername, setReplyingToUsername] = useState<string | null>(
    null,
  );
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [toastVisible, setToastVisible] = useState(false); // State to control toast visibility
  const [toastMessage, setToastMessage] = useState("");
  const [replyToggle, setReplyToggle] = useState<{ [key: string]: boolean }>(
    {},
  );
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    console.log("Updated comments:", comments);
  }, [comments]);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${getBaseUrl()}/api/comments/getComments?id=${postId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const post = await response.json();
      setCommentsLoaded(true);
      setComments(post.comment as Comment[]);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const isLikedByUser = (likes: string[]): boolean => {
    return likes.includes(myInfo?.id || '');
  };

  const isDislikedByUser = (dislikes: string[]): boolean => {
    return dislikes.includes(myInfo?.id || '');
  };

  const addComment = async (
    comment: string,
    userName: string,
    postId: string,
    userId: string,
    commentId: string | null,
    vote: string,
  ) => {

    let myId = myInfo?.id;
    try {
      const response = await fetch(
        `${getBaseUrl()}/api/comments/addComment?id=${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment,
            username: userName,
            postId,
            userId: myId,
            commentId,
            vote,
          }),
        },
      );
      const post = await response.json();
      setComments((prevComments) => {
        return [...prevComments, post.comment];
      });
      setComment("");
      setReplyingTo(null);
      setToastMessage("Comment successfully added!");
      setToastVisible(true);
      // await fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const response = await fetch(
        `${getBaseUrl()}/api/comments/deleteComment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: commentId }),
        },
      );

      if (response.ok) {
        const updatedComments = comments.filter(
          (comment) =>
            comment.id !== commentId && comment.parentId !== commentId,
        );
        setComments(updatedComments);
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const addCommentLike = async (userId: string, commentId: string) => {
    try {
      const response = await fetch(
        `${getBaseUrl()}/comments/addCommentLike`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, commentId }),
        },
      );

      const updatedComment = await response.json();
      // await fetchComments();
    } catch (error) {
      console.error("Error adding like to comment:", error);
    }
  };

  const addCommentDisike = async (userId: string, commentId: string) => {
    try {
      const response = await fetch(
        `${getBaseUrl()}/api/comments/addCommentDislike`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, commentId }),
        },
      );

      const updatedComment = await response.json();
      // await fetchComments();
    } catch (error) {
      console.error("Error adding like to comment:", error);
    }
  };

  const handleReplyClick = (commentId: string) => {
    console.log(inputRef.current, "this is inout ref");
    setIsReplying(true);
    setReplyingTo(commentId);

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const getParentComment = (parentId: string | null) => {
    if (!parentId) return null;
    return comments.find((comment) => comment?.id === parentId);
  };

  const getColor = (vote: string) => {
    switch (vote) {
      case "true":
        return "rgb(178,222,178, 0.5)";
      case "probably true":
        return "rgb(143, 201, 143, 0.3)";
      case "neutral":
        return "rgb(130, 135, 130, 0.3)";
      case "probably false":
        return "rgb(201, 75, 75, 0.2)";
      case "false":
        return "rgba(255, 0, 0, 0.5)";
    }
  };

  const profileImage = (id: string) => {
    if (id) {
      const newProfileImageUri = `${import.meta.env.VITE_APP_SUPABASE_URL
        }/storage/v1/object/public/ProfilePhotos/${id}.jpg`;
      return newProfileImageUri;
    }
  };

  const gotoTopic = (postId: string, id: string) => {
    console.log(postId, id);
    history.push(`/Comment/${id}/${myVote}/${postId}`);
  };

  function autoResize(textarea: any) {
    textarea.style.height = "auto"; // Reset height to calculate the new height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on content
  }


  console.log(myVote, 'this is my vote')

  const renderReplies = (commentId: string, nestedDepth = 0) => {
    return (
      <div
        className={`reply-container ${replyToggle[commentId] ? "open" : ""}`}
      >
        {comments
          .filter((reply) => reply.parentId === commentId)
          .map((reply) => {
            const parentInfo = getParentComment(reply.parentId);
            const parentColor = parentInfo
              ? getColor(parentInfo.vote)
              : "transparent";

            return (
              <div
                key={reply?.id}
                className={
                  nestedDepth < 1 ? "columnCommentWide" : `columnCommentWideNo`
                }
              >
                <div className="rowReply">
                  <div className="bottomImage">
                    <img
                      className="user-icon-small"
                      alt="User avatar"
                      src={"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAlQMBIgACEQEDEQH/xAAaAAEBAAMBAQAAAAAAAAAAAAAAAwECBAUH/8QAKxABAAICAAQEBgIDAAAAAAAAAAECAxEEEiFRMUFhgRQiMlJxkUKhEzOS/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD7iAAAAAAAAAAAAAAAAAAAAAAAAAANbXiPWU5yT+AWEOae8m57guIRe0ebeMneAUGImJ8JZAAAAAAAAAAASveZ6R4GS2+keDQAAAAAACJ1PRal4np5ogOga0tzQ2AAAAAAAa3nUNkcs/N+AagANb2ild28Gzj4m/Nk5fKvQC/E3mfl+WP7a/5sn3ymKjqxcRzTFb6j1dDzXbw1+bH1ncx0RVQAZrOpXc61J3UGwAAAAACFvqldC31SDAADgy/7b/l3uLia8uWZ8rdQSAVB08H4X9nM7OFrrHMz5gsAiimLzTb4vGQVAAAAAARv9UrJ5Y8wTAAa5KRkrqfaexa1aRu06hG3FR/Gsz+ZBK+DJSfDcd4T5LT/ABn9L/FW+yP2fFW+yP2Bi4edxOSOnZ1OX4q32R+1MfEUt9XyyCwACuKOiXovWNRoGQAAAAAGJjcaZAQmNTpraYrWbT4RG1715o9XHxm644ifOQcuS85Lbn2js1BUAAAAdHDZZ3GO07jydTzonUxMPSpXm12RW2OvXcqsRGoZAAAAAAAAATzYa5a6t7T2UAeZl4bJj665q94Qe0nfDjv9VI33B5I9CeCxzO4m0e7HwNPuv/SjgZrWbTqsTM+j0a8HijxiZ/MrVrWsarWIj0hBx4OC3qc3/MO2IiI1DIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z"}
                    />
                  </div>

                  <IonCard
                    style={{
                      border: `1px solid ${getColor(reply.vote)}`,
                    }}
                    className={`${"cardComment"} ${getColor(reply?.vote)}`}
                  >
                    <div style={{ width: "100%" }}>
                      <div className="rowUser">
                        <div className="userName">{reply.username}</div>
                      </div>
                      {parentInfo && (
                        <div
                          style={{ borderLeft: `4px solid ${parentColor}` }}
                          className="parentInfo"
                        >
                          <div className="parentUsername">
                            {parentInfo.username}
                          </div>
                          <div className="parentComment">
                            {parentInfo.comment}
                          </div>
                        </div>
                      )}
                      <div
                        style={{ width: "100%" }}
                        onClick={() => {
                          gotoTopic(postId, reply?.id);
                        }}
                      >
                        <div className="comment">{reply?.comment}</div>
                      </div>
                      <div
                        style={{
                          paddingTop: "3px",
                          paddingBottom: "3px",
                        }}
                        className="reply"
                        onClick={() => handleReplyClick(reply?.id)}
                      >
                        Reply
                      </div>
                      {myInfo?.username === reply.username && (
                        <button onClick={() => deleteComment(reply.id)}>
                          <IonIcon icon={trashBin}></IonIcon>
                        </button>
                      )}
                    </div>
                  </IonCard>
                </div>
                {comments.some((r) => r.parentId === reply?.id) && (
                  <div
                    className="seeMore"
                    onClick={() => toggleReplies(reply?.id)}
                  >
                    {replyToggle[reply?.id] ? "- Hide Replies" : "+ See More"}
                  </div>
                )}
                {replyToggle[reply?.id] &&
                  renderReplies(reply?.id, nestedDepth + 1)}
              </div>
            );
          })}
      </div>
    );
  };

  const toggleReplies = (commentId: string) => {
    const shouldHide = replyToggle[commentId];

    const hideNestedReplies = (id: string) => {
      comments
        .filter((comment) => comment.parentId === id)
        .forEach((comment) => {
          setReplyToggle((prevState) => ({
            ...prevState,
            [comment?.id]: false,
          }));
          hideNestedReplies(comment?.id);
        });
    };

    setReplyToggle((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));

    if (shouldHide) {
      hideNestedReplies(commentId);
    }
  };

  const calculateNetScore = (likes: string[], dislikes: string[]): number => {
    return likes.length - dislikes.length;
  };

  

  return (
    <div>
      <IonToast
        isOpen={toastVisible}
        onDidDismiss={() => setToastVisible(false)} // Hide toast when dismissed
        message={toastMessage}
        duration={1000}
        position="top"
        cssClass="custom-toast"
      />
      {commentsLoaded ? (
        <div className="rowWide">
          {/* <textarea
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addComment(
                comment,
                myInfo?.username,
                postId,
                myInfo?.id,
                null,
                myVote,
              );
            }
          }}
          className="input"
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add Comment"
          value={comment}
        />
        <button
          className="noPadding"
          onClick={() =>
            addComment(
              comment,
              myInfo?.username,
              postId,
              myInfo?.id,
              null,
              myVote,
            )
          }
        >
          <IonIcon size="small" icon={send}></IonIcon>
        </button> */}
        </div>
      ) : (
        <IonList style={{ height: "400px" }}>
          <IonItem
            lines="none"
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <IonLabel>
              <h3>
                <IonSkeletonText
                  animated={true}
                  style={{ width: "100%" }}
                ></IonSkeletonText>
              </h3>
              <p>
                <IonSkeletonText
                  animated={true}
                  style={{ width: "100%" }}
                ></IonSkeletonText>
              </p>
              <p>
                <IonSkeletonText
                  animated={true}
                  style={{ width: "100%" }}
                ></IonSkeletonText>
              </p>
            </IonLabel>
          </IonItem>
        </IonList>
      )}

      {comments
        ?.filter((comment) => comment?.parentId === null)
        .map((comment) =>             
          (
          <div className="column">
            <div className="imageRow" key={comment?.id}>
              <div className="bottomImage">
                <img
                  className="user-icon-small"
                  alt="User avatar"
                  src={profileImage(comment?.userId)}
                />
              </div>
              <div
                className="commentRow"
                style={{ flexDirection: "column", alignItems: "center" }}
              >
                <div className="columnWide">
                  <IonCard
                    className={`${"cardComment"}`}
                    style={{ border: `1px solid ${getColor(comment.vote)}` }}
                  >
                    <div style={{ width: "95%", padding: "3px" }}>
                      <div className="rowUser">
                        <div className="userName">{comment.username}</div>
                      </div>
                      <div
                        style={{ width: "100%" }}
                        onClick={() => {
                          gotoTopic(postId, comment?.id);
                        }}
                      >
                        <div className="comment">{comment?.comment}</div>
                      </div>
                      <div
                        className="reply"
                        onClick={() => {
                          handleReplyClick(comment?.id);
                          setReplyingToUsername(comment?.username);
                          setReplyCommentId(comment.id);
                        }}
                      >
                        Reply
                      </div>
                    </div>
                    <div className="voteRowSmall">
                      <div className="rowSmall">
                        <div className="arrowRowSmall">
                          <IonIcon
                            onClick={() => {
                              if(myInfo)
                              addCommentLike(myInfo.id, comment.id);
                            }}
                            icon={
                              isLikedByUser(comment?.likes)
                                ? arrowUpCircle
                                : arrowUpCircleOutline
                            }
                          ></IonIcon>
                          <div className="small">
                            {calculateNetScore(
                              comment?.likes,
                              comment?.dislikes,
                            )}
                          </div>
                        </div>
                        <div className="arrowRowSmall">
                          <IonIcon
                            onClick={() => {
                              if (myInfo)
                                addCommentDisike(myInfo.id, comment.id);
                            }}
                            icon={
                              isDislikedByUser(comment?.dislikes)
                                ? arrowDownCircle
                                : arrowDownCircleOutline
                            }
                          ></IonIcon>
                          <div className="small">
                            {calculateNetScore(
                              comment?.likes,
                              comment?.dislikes,
                            )}
                          </div>
                        </div>
                        <div>
                          {/* <IonIcon size="small" onClick={() => {  }} icon={chatbubbleOutline}></IonIcon>
                      {comment.replies.length} */}
                        </div>
                      </div>
                      <div>
                        {myInfo?.username === comment.username && (
                          <button onClick={() => deleteComment(comment.id)}>
                            <IonIcon icon={trashBin}></IonIcon>
                          </button>
                        )}
                      </div>
                    </div>
                  </IonCard>
                </div>
                {comments.some((reply) => reply?.parentId === comment?.id) && (
                  <div
                    className="seeMore"
                    onClick={() => toggleReplies(comment.id)}
                  >
                    {replyToggle[comment.id]
                      ? "- Hide Replies"
                      : "+ See All Replies"}
                  </div>
                )}
              </div>
            </div>
            {replyToggle[comment?.id] && renderReplies(comment?.id)}
          </div>
        ))}
      <div className="message-input-container">
        {isReplying && replyingToUsername ? (
          <div style={{ marginBottom: "10px", fontSize: "14px" }}>
            Replying To @{replyingToUsername}
          </div>
        ) : (
          <></>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            backgroundColor: "white",
          }}
        >
          <textarea
            className="textAreaWhite"
            onBlur={() => {
              setIsReplying(false);
              setReplyingToUsername("");
              setReplyCommentId(null)
              setReplyingTo(null);
            }}
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Prevents new line on Enter
                addComment(
                  replyComment,
                  myInfo?.username || "",
                  postId,
                  myInfo?.id || "",
                  replyCommentId,
                  myVote,
                );
                setReplyComment("");
              }
            }}
            value={replyComment}
            onChange={(e) => {
              setReplyComment(e.target.value!);
              autoResize(e.target);
            }}
            placeholder="Type your reply..."
          />
          <IonIcon
            style={{ position: "relative", zIndex: "10" }}
            size="small"
            icon={sendOutline}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              addComment(
                replyComment,
                myInfo?.username || "",
                postId,
                myInfo?.id || "",
                replyCommentId,
                myVote,
              );
              setReplyComment("");
              setReplyingToUsername("");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Replies;
