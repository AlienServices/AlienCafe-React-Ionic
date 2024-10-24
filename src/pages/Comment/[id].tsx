import {
  IonContent,
  IonHeader,
  IonRouterLink,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonCardSubtitle,
  IonIcon,
  IonImg
} from "@ionic/react";
import {
  heartCircle,
  chatbubbleOutline,
  bookmarkOutline,
  shareOutline,
  checkmarkCircleOutline,
  arrowDownCircleOutline,
  arrowBackCircleOutline,
  arrowUpCircleOutline,
  arrowUpCircle,
  arrowDownCircle,
} from "ionicons/icons";
import { MyContext } from "../../providers/postProvider";
import { useParams } from "react-router-dom";
import { sendOutline, trashBin } from "ionicons/icons";
import { useHistory } from 'react-router-dom';
import { useEffect, useState, useContext } from "react";
import "../../theme/comment.css";

const Comment = () => {
  const { myInfo } = useContext(MyContext);
  const [comments, setComments] = useState<any | null>(null); // Adjust type as needed
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { myVote } = useParams<{ myVote: string }>();
  const { postId } = useParams<{ postId: string }>();
  const [replyComment, setReplyComment] = useState<string>("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyToggle, setReplyToggle] = useState<{ [key: string]: boolean }>(
    {},
  );

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/getComment?id=${id}`, // Adjust API endpoint as necessary
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      setComments(data.comment);
      console.log(data.comment, "these are comments");
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const getColor = (vote: string) => {
    switch (vote) {
      case "yes":
        return "green";
      case "no":
        return "red";
      case "maybe":
        return "#fffc69";
      default:
        return "grey";
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/deleteComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: commentId }),
      });

      // if (response.ok) {
      //   const updatedComments = comments.filter(
      //     (comment) =>
      //       comment.id !== commentId && comment.parentId !== commentId,
      //   );
      //   setComments(updatedComments);
      // } else {
      //   console.error("Failed to delete comment");
      // }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleReplyClick = (commentId: string) => {
    setReplyingTo((prevId) => (prevId === commentId ? null : commentId));
  };

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
        `http://localhost:3000/api/addComment?id=${id}`,
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
      console.log(post, "this is the post response");
      setComments(post.comment);
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const getParentComment = (parentId: string | null, comments: any) => {
    if (!parentId) {
      console.log("No parentId provided");
      return null;
    }



    // Function to recursively find the parent comment
    const findParent = (commentsObj: any, parentId: string): any => {
      // Check if this is the parent comment
      if (commentsObj.id === parentId) {
        return commentsObj;
      }

      // If there are replies, search them recursively
      if (commentsObj.replies && commentsObj.replies.length > 0) {
        for (let reply of commentsObj.replies) {
          const parentComment = findParent(reply, parentId);
          if (parentComment) return parentComment;
        }
      }

      return null;
    };

    // Start the search from the top-level comments object
    return findParent(comments, parentId);
  };

  const addCommentLike = async (userId: string, commentId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/addCommentLike`, {
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
        `http://localhost:3000/api/addCommentDislike`,
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
    return likes.includes(myInfo.id);
  };

  const isDislikedByUser = (dislikes: string[]): boolean => {
    // Check if the likes array includes your user ID
    return dislikes.includes(myInfo.id);
  };

  const calculateNetScore = (likes: string[], dislikes: string[]): number => {
    return likes.length - dislikes.length;
  };

  const renderReplies = (replies: any[], isFirstLevel = true) => {
    return replies.map((reply) => {
      const parentInfo = getParentComment(reply.parentId, comments);
      const parentColor = parentInfo
        ? getColor(parentInfo.vote)
        : "transparent";

      return (
        <>
          <div
            key={reply.id}
            style={{
              marginTop: "10px",
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <img
              className="user-icon-small"
              alt="User avatar"
              src="https://ionicframework.com/docs/img/demos/avatar.svg"
              style={{ marginRight: "10px" }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  border: `2px solid ${getColor(reply.vote)}`,
                  padding: "10px",
                }}
              >
                <div className="rowUserNoSpace">
                  <div className="userName">{reply.username}</div>
                  {myInfo?.username === reply.username && (
                    <button>
                      <IonIcon
                        onClick={() => deleteComment(reply.id)}
                        icon={trashBin}
                      ></IonIcon>
                    </button>
                  )}
                </div>
                {parentInfo && (
                  <div
                    style={{ borderLeft: `4px solid ${parentColor}` }}
                    className="parentInfo"
                  >
                    <div className="parentUsername">{parentInfo.username}</div>
                    <div className="parentComment">{parentInfo.comment}</div>
                  </div>
                )}
                <div className="comment">{reply.comment}</div>
                <div
                  className="reply"
                  onClick={() => handleReplyClick(reply.id)}
                >
                  Reply
                </div>
                <div className="voteRowSmall">
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
                {replyingTo === reply.id && (
                  <div className="replyInput">
                    <input
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
                          reply.id,
                          myVote,
                        )
                      }
                    >
                      Send
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {replyToggle[reply.id] && renderReplies(reply.replies, false)}
        </>
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
  console.log(comments, "responded comments");

  return (
    <IonPage>
      <IonContent>
        <div className="brown">
          <div className="leftMiddle">
            <div style={{
              borderRadius: '10px', backgroundColor: 'white', width: '45px', display: 'flex', justifyContent: 'center',
              height: '45px', alignItems: 'center', margin: '10px'
            }}>
              <IonIcon
                onClick={() => {
                  goBack()
                }}
                style={{
                  fontSize: '28px',
                  color: 'black',
                }}
                color="primary"
                icon={arrowBackCircleOutline}>
              </IonIcon>
            </div>
            <div className="logoContainer">
              <IonImg style={{ width: '60px', height: '60px' }} src="/AlienCafeLogo1.png"></IonImg>
            </div>
          </div>
        </div>
        {comments && (
          <div className="padding">
            <IonCard
              style={{ border: `2px solid ${getColor(comments?.vote)}` }}
            >
              <div style={{ width: "95%", padding: "3px" }}>
                <div className="rowUserNoSpace">
                  <img
                    className="user-icon-small"
                    alt="User avatar"
                    src="https://ionicframework.com/docs/img/demos/avatar.svg"
                  />
                  <div className="userName">{comments?.username}</div>
                  {myInfo?.username === comments?.username && (
                    <button>
                      <IonIcon
                        onClick={() => deleteComment(id)}
                        icon={trashBin}
                      ></IonIcon>
                    </button>
                  )}
                </div>
                <div className="comment">{comments?.comment}</div>
                <div
                  className="reply"
                  onClick={() => handleReplyClick(comments?.id)}
                >
                  Reply
                </div>
              </div>
              {replyingTo === comments?.id && (
                <div className="replyInput">
                  <input
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addComment(
                          replyComment,
                          myInfo?.username,
                          postId,
                          myInfo?.id,
                          comments.id,
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
                    onClick={() => {
                      addComment(
                        replyComment,
                        myInfo?.username,
                        postId,
                        myInfo?.id,
                        comments.id,
                        myVote,
                      );
                    }}
                  >
                    Send
                  </button>
                </div>
              )}
              <div className="voteRowSmall">
                <IonIcon
                  onClick={() => addCommentLike(myInfo.id, comments.id)}
                  icon={
                    isLikedByUser(comments?.likes)
                      ? arrowUpCircle
                      : arrowUpCircleOutline
                  }
                ></IonIcon>
                <div className="small">
                  {calculateNetScore(comments?.likes, comments?.dislikes)}
                </div>
                <IonIcon
                  onClick={() => addCommentDisike(myInfo.id, comments.id)}
                  icon={
                    isDislikedByUser(comments?.dislikes)
                      ? arrowDownCircle
                      : arrowDownCircleOutline
                  }
                ></IonIcon>
              </div>
              {comments?.replies && comments?.replies.length > 0 && (
                <div>
                  {replyToggle[comments.id] && renderReplies(comments?.replies)}
                </div>
              )}
            </IonCard>

            {comments?.replies &&
              comments?.replies.length > 0 &&
              renderReplies(comments?.replies)}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Comment;
