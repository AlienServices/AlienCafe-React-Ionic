import {
  IonContent,
  IonPage,
  IonCard,
  IonIcon,
  IonImg,
  IonFooter,
  IonTextarea,
  useIonViewDidLeave,
  useIonViewWillLeave,
} from "@ionic/react";
import {
  arrowDownCircleOutline,
  arrowBackCircleOutline,
  arrowUpCircleOutline,
  arrowUpCircle,
  arrowDownCircle,
} from "ionicons/icons";
import { Keyboard } from "@capacitor/keyboard";
import { useParams } from "react-router-dom";
import { sendOutline, trashBin } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import "../../theme/comment.css";
import { UserContext } from "../../providers/userProvider";
import HeaderAlien from "../../components/preRender/Header";

const Comment = () => {
  const { myInfo } = useContext(UserContext);
  const [comments, setComments] = useState<any | null>(null);
  const { id } = useParams<{ id: string }>();
  const { myVote } = useParams<{ myVote: string }>();
  const [toggle, setToggle] = useState(true);
  const [commentReplyId, setCommentReplyId] = useState(null);
  const { postId } = useParams<{ postId: string }>();
  const history = useHistory();
  const [replyingToUsername, setReplyingToUsername] = useState<string | null>(
    null,
  );
  const [isReplying, setIsReplying] = useState(false);
  const [replyComment, setReplyComment] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyToggle, setReplyToggle] = useState<{ [key: string]: boolean }>(
    {},
  );

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://10.1.10.233:3000/api/comments/getComment?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      setComments(data.comment);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const getColor = (vote: string) => {
    switch (vote) {
      case "true":
        return "rgb(178,222,178, 0.6)";
      case "probably true":
        return "rgb(178,222,178, 0.6)";
      case "neutral":
        return "rgb(178,222,178, 0.6)";
      case "probably false":
        return "rgb(207,151,134, 0.6)";
      case "false":
        return "#fffc69";
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const response = await fetch(
        `http://10.1.10.233:3000/api/comments/deleteComment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: commentId }),
        },
      );

      // if (response.ok) {
      //   const updatedComments = comments.filter(
      //     (comment) =>
      //       comment.id !== commentId && comment.parentId !== commentId,
      //   );
      //   setComments(updatedComments);
      // } else {
      //   console.error("Failed to delete comment");
      // }
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleReplyClick = () => {
    setTimeout(() => {
      setIsReplying(!isReplying);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }, 100);
  };

  // const handleCommentReplyClick = (commentId: string) => {
  //   setReplyingTo(commentId);

  //   setTimeout(() => {
  //     setTimeout(() => {
  //       inputRef.current?.focus();
  //     }, 100);
  //   }, 300);
  // };

  useEffect(() => {
    fetchComments();
  }, [id]);

  const addComment = async (
    comment: string,
    userName: string,
    postId: string,
    userId: string,
    commentId: string | null,
    vote: string,
  ) => {

    try {
      const response = await fetch(
        `http://10.1.10.233:3000/api/comments/addComment?id=${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment,
            userName,
            postId,
            userId,
            commentId: commentReplyId ? commentReplyId : commentId,
            vote,
          }),
        },
      );
      const post = await response.json();
      setReplyComment("");
      setComments(post.comment);
      fetchComments();
      setCommentReplyId(null)
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const getParentComment = (parentId: string | null, comments: any) => {
    if (!parentId) {
      console.log("No parentId provided");
      return null;
    }

    const findParent = (commentsObj: any, parentId: string): any => {
      if (commentsObj.id === parentId) {
        return commentsObj;
      }
      if (commentsObj.replies && commentsObj.replies.length > 0) {
        for (let reply of commentsObj.replies) {
          const parentComment = findParent(reply, parentId);
          if (parentComment) return parentComment;
        }
      }

      return null;
    };
    return findParent(comments, parentId);
  };

  const addCommentLike = async (userId: string, commentId: string) => {
    try {
      const response = await fetch(
        `http://10.1.10.233:3000/comments/addCommentLike`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, commentId }),
        },
      );

      const updatedComment = await response.json();
      await fetchComments();
    } catch (error) {
      console.error("Error adding like to comment:", error);
    }
  };

  const addCommentDisike = async (userId: string, commentId: string) => {
    try {
      const response = await fetch(
        `http://10.1.10.233:3000/api/comments/addCommentDislike`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, commentId }),
        },
      );

      const updatedComment = await response.json();
      await fetchComments();
    } catch (error) {
      console.error("Error adding like to comment:", error);
    }
  };

  const isLikedByUser = (likes: string[]): boolean => {
    return likes.includes(myInfo?.id);
  };

  const isDislikedByUser = (dislikes: string[]): boolean => {
    return dislikes.includes(myInfo?.id);
  };

  const calculateNetScore = (likes: string[], dislikes: string[]): number => {
    return likes.length - dislikes.length;
  };

  const profileImage = (id: string) => {
    if (id) {
      const newProfileImageUri = `${import.meta.env.VITE_APP_SUPABASE_URL
        }/storage/v1/object/public/ProfilePhotos/${id}.jpg`;
      return newProfileImageUri;
    }
  };

  useIonViewWillLeave(() => {
    console.log("Cleaning up resources...");
    setToggle(false);
  });

  useIonViewDidLeave(() => {
    console.log("Cleaning up resources...");
    setToggle(true);
  });

  const renderReplies = (replies: any[], isFirstLevel = true) => {
    return replies.map((reply) => {
      const parentInfo = getParentComment(reply.parentId, comments);
      const parentColor = parentInfo
        ? getColor(parentInfo.vote)
        : "transparent";
      return (
        <div>
          <div
            key={reply.id}
            style={{
              marginTop: "10px",
              marginLeft: "10px",
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <img
              className="user-icon-small"
              alt="User avatar"
              src={profileImage(reply.userId)}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  border: `1px solid ${getColor(reply.vote)}`,
                  padding: "3px",
                  borderRadius: "5px",
                  width: "98%",
                  borderBottomLeftRadius: "0px",
                }}
              >
                <div className="rowUserNoSpace">
                  <div className="userName">{reply.username}</div>
                </div>
                {parentInfo && (
                  <div
                    style={{ borderLeft: `4px solid ${parentColor}` }}
                    className="parentInfo"
                    onClick={() => {
                      gotoTopic(postId, reply.id);
                    }}
                  >
                    <div className="parentUsername">{parentInfo.username}</div>
                    <div className="parentComment">{parentInfo.comment}</div>
                  </div>
                )}
                <div className="comment">{reply.comment}</div>
                <div
                  className="reply"
                  onClick={(e) => {
                    e.preventDefault();
                    setReplyingToUsername(reply?.username);
                    handleReplyClick(reply.id);
                    setCommentReplyId(reply.id)
                  }}
                >
                  Reply
                </div>
                <div className="voteRowSmall">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                      width: "20%",
                    }}
                  >
                    <IonIcon
                      onClick={() => addCommentLike(myInfo.id, reply.id)}
                      icon={
                        isLikedByUser(reply?.likes)
                          ? arrowUpCircle
                          : arrowUpCircleOutline
                      }
                    ></IonIcon>
                    <div className="small">
                      {calculateNetScore(reply?.likes, reply?.dislikes)}
                    </div>
                    <IonIcon
                      onClick={() => addCommentDisike(myInfo.id, reply.id)}
                      icon={
                        isDislikedByUser(reply?.dislikes)
                          ? arrowDownCircle
                          : arrowDownCircleOutline
                      }
                    ></IonIcon>
                  </div>
                  {myInfo?.username === reply.username && (
                    <button>
                      <IonIcon
                        onClick={() => deleteComment(reply.id)}
                        icon={trashBin}
                      ></IonIcon>
                    </button>
                  )}
                </div>
              </div>
              {reply.replies && reply.replies.length > 0 && (
                <div>
                  <div
                    className="seeMore"
                    onClick={() => toggleReplies(reply.id)}
                  >
                    {replyToggle[reply.id]
                      ? "- Hide Replies"
                      : "+ See All Replies"}
                  </div>
                </div>
              )}
            </div>
          </div>
          {replyToggle[reply.id] && renderReplies(reply.replies, false)}
        </div>
      );
    });
  };

  const toggleReplies = (commentId: string) => {
    setReplyToggle((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  const goBack = () => {
    history.goBack();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      addComment(replyComment, myInfo.username, id, myInfo.id);
    }
  };

  const gotoTopic = (postId: string, id: string) => {
    console.log(postId, id);
    history.push(`/Comment/${id}/${myVote}/${postId}`);
  };

  return (
    <IonPage
      style={{
        opacity: toggle ? "1" : "0",
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <HeaderAlien backArrowToggle={true} />
      <IonContent >
        {comments && (
          <div style={{ display: "flex", flexDirection: "column", height:"fit-content", paddingBottom: '150px' }}>
            <div style={{ display: "flex" }}>
              <img
                className="user-icon-small"
                alt="User avatar"
                src={profileImage(comments.userId)}
              />
              <div className="padding">
                <IonCard
                  style={{
                    border: `1px solid ${getColor(comments?.vote)}`,
                    boxShadow: "none",
                    borderBottomLeftRadius: "0px",
                    padding: "4px",
                  }}
                >
                  <div style={{ width: "95%", padding: "3px" }}>
                    <div className="rowUserNoSpace">
                      <div className="userName">{comments?.username}</div>
                    </div>
                    <div className="comment">{comments?.comment}</div>
                    <div
                      className="reply"
                      onClick={() => {
                        handleReplyClick(comments?.id);
                        setReplyingToUsername(comments?.username);
                      }}
                    >
                      Reply
                    </div>
                  </div>

                  <div className="voteRowSmall">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                        width: "20%",
                      }}
                    >
                      <div className="small" style={{ color: "black" }}>
                        {calculateNetScore(comments?.likes, comments?.dislikes)}
                      </div>
                      <IonIcon
                        style={{ color: "black" }}
                        onClick={() => addCommentLike(myInfo.id, comments.id)}
                        icon={
                          isLikedByUser(comments?.likes)
                            ? arrowUpCircle
                            : arrowUpCircleOutline
                        }
                      ></IonIcon>
                      <div className="small" style={{ color: "black" }}>
                        {calculateNetScore(comments?.likes, comments?.dislikes)}
                      </div>
                      <IonIcon
                        style={{ color: "black" }}
                        onClick={() => addCommentDisike(myInfo.id, comments.id)}
                        icon={
                          isDislikedByUser(comments?.dislikes)
                            ? arrowDownCircle
                            : arrowDownCircleOutline
                        }
                      ></IonIcon>
                    </div>
                    {myInfo?.username === comments?.username && (
                      <button>
                        <IonIcon
                          onClick={() => deleteComment(id)}
                          icon={trashBin}
                        ></IonIcon>
                      </button>
                    )}
                  </div>

                  {/* {comments?.replies && comments?.replies.length > 0 && (
                  <div>
                    {replyToggle[comments.id] && renderReplies(comments?.replies)}
                  </div>
                )} */}
                </IonCard>
              </div>
            </div>
            {comments?.replies &&
              comments?.replies.length > 0 &&
              renderReplies(comments?.replies)}
          </div>
        )}

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
              }}
              ref={inputRef}
              onKeyDown={(e: React.KeyboardEvent<HTMLIonTextareaElement>) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addComment(
                    e.target.value,
                    myInfo?.username,
                    postId,
                    myInfo?.id,
                    id,
                    myVote,
                  );
                }
              }}
              value={replyComment}
              onInput={(e) => setReplyComment(e.target.value!)}
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
                  myInfo?.username,
                  postId,
                  myInfo?.id,
                  id,
                  myVote,
                );
                Keyboard.hide();
                setIsReplying(false);
              }}
            />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Comment;
