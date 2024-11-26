import { useState, useEffect, useContext, useRef } from "react";
import { IonCard, IonIcon, IonFooter, IonTextarea, IonSkeletonText, IonLabel, IonList, IonItem, useIonViewWillLeave, useIonViewDidLeave } from "@ionic/react";
import { send, sendOutline, trashBin } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import {
  arrowDownCircleOutline,
  arrowUpCircleOutline,
  arrowUpCircle,
  arrowDownCircle,
} from "ionicons/icons";
import Comment from "../pages/Comment/[id]";
import { UserContext } from "../providers/userProvider";

interface Comment {
  id: string;
  parentId: string | null;
  comment: string;
  username: string;
  vote: string;
}

interface RepliesProps {
  postId: string;
  myVote: string;
}

const Replies: React.FC<RepliesProps> = ({ postId, myVote }) => {
  const { myInfo } = useContext(UserContext);
  const [comments, setComments] = useState<Comment[]>([]);
  const history = useHistory();
  const [comment, setComment] = useState<string>("");
  const [replyComment, setReplyComment] = useState<string>("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [commentsLoaded, setCommentsLoaded] = useState(false)
  const [isReplying, setIsReplying] = useState(false);
  const [replyToggle, setReplyToggle] = useState<{ [key: string]: boolean }>(
    {},
  );
  const inputRef = useRef<HTMLIonTextareaElement>(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    console.log('hitting fetch comments')
    try {
      const response = await fetch(
        `http://10.1.10.233:3000/api/getComments?id=${postId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const post = await response.json();
      setCommentsLoaded(true)
      setComments(post.comment as Comment[]);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const isLikedByUser = (likes: string[]): boolean => {
    return likes.includes(myInfo.id);
  };

  const isDislikedByUser = (dislikes: string[]): boolean => {
    return dislikes.includes(myInfo.id);
  };

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
        `http://10.1.10.233:3000/api/addComment?id=${postId}`,
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
            commentId,
            vote,
          }),
        },
      );
      const post = await response.json();
      console.log(post, "this is the post");
      setComments(post.comments as Comment[]);
      setComment("");
      setReplyingTo(null);
      await fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`http://10.1.10.233:3000/api/deleteComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: commentId }),
      });

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
      const response = await fetch(`http://10.1.10.233:3000/api/addCommentLike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, commentId }),
      });

      const updatedComment = await response.json();
      await fetchComments();
    } catch (error) {
      console.error("Error adding like to comment:", error);
    }
  };

  const addCommentDisike = async (userId: string, commentId: string) => {
    try {
      const response = await fetch(
        `http://10.1.10.233:3000/api/addCommentDislike`,
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

  const handleReplyClick = (commentId: string) => {
    setIsReplying(!isReplying);
    // setReplyingTo(commentId);
    setTimeout(() => {
      inputRef.current?.setFocus();
    }, 400);
  };


  const getParentComment = (parentId: string | null) => {
    if (!parentId) return null;
    return comments.find((comment) => comment.id === parentId);
  };

  const getColor = (vote: string) => {
    switch (vote) {
      case "true":
        return "rgb(178,222,178";
      case "probably true":
        return "rgb(178,222,178";
      case "neutral":
        return "rgb(178,222,178";
      case "probably false":
        return "rgb(207,151,134)";
      case "false":
        return "#fffc69";
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



  const renderReplies = (commentId: string, nestedDepth = 0) => {
    return (
      <div
        className={`reply-container ${replyToggle[commentId] ? "open" : ""
          }`}
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
                key={reply.id}
                className={
                  nestedDepth < 1
                    ? "columnCommentWide"
                    : `columnCommentWideNo`
                }
              >
                <div className="rowReply">
                  <div className="bottomImage">
                    <img
                      className="user-icon-small"
                      alt="User avatar"
                      src={profileImage(reply.userId)}
                    />
                  </div>

                  <IonCard
                    style={{
                      border: `1px solid ${getColor(reply.vote)}`,
                    }}
                    className={`${"cardComment"} ${getColor(reply.vote)}`}
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
                          gotoTopic(postId, reply.id);
                        }}
                      >
                        <div className="comment">{reply.comment}</div>
                      </div>
                      <div
                        style={{
                          paddingTop: "3px",
                          paddingBottom: "3px",
                        }}
                        className="reply"
                        onClick={() => handleReplyClick(reply.id)}
                      >
                        Reply
                      </div>
                    </div>
                  </IonCard>
                </div>
                {comments.some((r) => r.parentId === reply.id) && (
                  <div
                    className="seeMore"
                    onClick={() => toggleReplies(reply.id)}
                  >
                    {replyToggle[reply.id] ? "- Hide Replies" : "+ See More"}
                  </div>
                )}
                {replyToggle[reply.id] &&
                  renderReplies(reply.id, nestedDepth + 1)}
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
            [comment.id]: false,
          }));
          hideNestedReplies(comment.id);
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
      {commentsLoaded ? <div className="rowWide">
        <textarea
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
        </button>
      </div> : <IonList style={{ height: '400px' }}>
        <IonItem lines="none" style={{ height: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <IonLabel>
            <h3>
              <IonSkeletonText animated={true} style={{ width: '100%' }}></IonSkeletonText>
            </h3>
            <p>
              <IonSkeletonText animated={true} style={{ width: '100%' }}></IonSkeletonText>
            </p>
            <p>
              <IonSkeletonText animated={true} style={{ width: '100%' }}></IonSkeletonText>
            </p>
          </IonLabel>
        </IonItem>
      </IonList>}


      {comments?.filter((comment) => comment.parentId === null)
        .map((comment) => (
          <div className="column">
            <div className="imageRow" key={comment.id}>
              <div className="bottomImage">
                <img
                  className="user-icon-small"
                  alt="User avatar"
                  src={profileImage(comment.userId)}
                />
              </div>
              <div className="commentRow" style={{ flexDirection: 'column', alignItems: 'center' }}>
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
                          gotoTopic(postId, comment.id);
                        }}
                      >
                        <div className="comment">{comment.comment}</div>
                      </div>
                      <div
                        className="reply"
                        onClick={() => handleReplyClick(comment.id)}
                      >
                        Reply
                      </div>
                    </div>
                    {/* {replyingTo === comment.id && (
                      <div className="replyInput">
                        <input
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              addComment(
                                replyComment,
                                myInfo?.username,
                                postId,
                                myInfo?.id,
                                comment.id,
                                myVote,
                              );
                            }
                          }}
                          className="inputReply"
                          onChange={(e) => setReplyComment(e.target.value)}
                          placeholder="Reply..."
                        />
                        <button
                          className="noPadding"
                          onClick={() =>
                            addComment(
                              replyComment,
                              myInfo?.username,
                              postId,
                              myInfo?.id,
                              comment.id,
                              myVote,
                            )
                          }
                        >
                          Send
                        </button>
                      </div>
                    )} */}
                    <div className="voteRowSmall">
                      <div className="rowSmall">
                        <div className="arrowRowSmall">
                          <IonIcon
                            onClick={() => {
                              addCommentLike(myInfo.id, comment.id);
                            }}
                            icon={
                              isLikedByUser(comment?.likes)
                                ? arrowUpCircle
                                : arrowUpCircleOutline
                            }
                          ></IonIcon>
                          <div className="small">
                            {calculateNetScore(comment?.likes, comment?.dislikes)}
                          </div>
                        </div>
                        <div className="arrowRowSmall">
                          <IonIcon
                            onClick={() => {
                              addCommentDisike(myInfo.id, comment.id);
                            }}
                            icon={
                              isDislikedByUser(comment?.dislikes)
                                ? arrowDownCircle
                                : arrowDownCircleOutline
                            }
                          ></IonIcon>
                          <div className="small">
                            {calculateNetScore(comment?.likes, comment?.dislikes)}
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
                {comments.some((reply) => reply.parentId === comment.id) && (
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
            {replyToggle[comment.id] && renderReplies(comment.id)}
          </div>
        ))}
      {/* {isReplying && ()} */}
      <IonFooter className="message-input-container">
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
          <IonTextarea
            className="textAreaWhite"
            onBlur={() => { setIsReplying(false) }}
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Prevents new line on Enter
                addComment(
                  replyComment,
                  myInfo?.username,
                  postId,
                  myInfo?.id,
                  comment.id,
                  myVote,)
              }
            }}
            value={replyComment}
            onIonChange={(e) => setReplyComment(e.detail.value!)}
            placeholder="Type your reply..."
          />
          <IonIcon style={{ position: 'relative', right: '40px', zIndex: '10' }} size="large" icon={sendOutline} onMouseDown={(e) => e.preventDefault()} onClick={() => {
            addComment(
              replyComment,
              myInfo?.username,
              postId,
              myInfo?.id,
              comment.id,
              myVote,)
          }} />
        </div>
      </IonFooter>

    </div>
  );
};

export default Replies;
