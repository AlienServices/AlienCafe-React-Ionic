import {
  IonContent,
  IonPage,
  IonCard,
  IonIcon,
  IonImg,
  IonFooter,
  IonTextarea
} from "@ionic/react";
import {
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
import { useEffect, useState, useContext, useRef } from "react";
import "../../theme/comment.css";

const Comment = () => {
  const { myInfo } = useContext(MyContext);
  const [comments, setComments] = useState<any | null>(null); // Adjust type as needed
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [isReplying, setIsReplying] = useState(false);
  const { myVote } = useParams<{ myVote: string }>();
  const { postId } = useParams<{ postId: string }>();
  const [replyComment, setReplyComment] = useState<string>("");
  const inputRef = useRef<HTMLIonInputElement>(null);
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

  const handleReplyClick = () => {

    setTimeout(() => {
      setIsReplying(!isReplying);

      setTimeout(() => {
        inputRef.current?.setFocus();
      }, 100);
    }, 300);
  };

  const handleCommentReplyClick = (commentId: string) => {
    setReplyingTo(commentId);

    setTimeout(() => {
      setTimeout(() => {
        inputRef.current?.setFocus();
      }, 100);
    }, 300);
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
    return dislikes.includes(myInfo.id);
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
              marginLeft: '10px',
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
                  borderRadius: '5px',
                  width: '98%',
                  borderBottomLeftRadius: '0px'
                }}
              >
                <div className="rowUserNoSpace">
                  <div className="userName">{reply.username}</div>
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
                  onClick={() => handleCommentReplyClick(reply.id)}
                >
                  Reply
                </div>
                <div className="voteRowSmall">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', width: '20%' }}>
                    <IonIcon
                      onClick={() => addCommentLike(myInfo.id, reply.id)}
                      icon={
                        isLikedByUser(reply?.likes)
                          ? arrowUpCircle
                          : arrowUpCircleOutline
                      }
                    ></IonIcon>
                    <div className="small" >
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
                  <div className="message-input-container" style={{}}>
                    <IonTextarea
                      onBlur={() => { setReplyingTo(null) }}
                      ref={inputRef}
                      // onKeyDown={}              
                      value={replyComment}
                      onIonChange={(e) => setReplyComment(e.detail.value!)}
                      placeholder="Type your reply..."
                    />
                    <IonIcon style={{ marginLeft: '3px', padding: '5px' }} size="large" icon={sendOutline} onMouseDown={(e) => e.preventDefault()} onClick={() => {
                      addComment(
                        replyComment,
                        myInfo?.username,
                        postId,
                        myInfo?.id,
                        reply.id,
                        myVote,
                      )
                    }} />
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


  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      addComment(replyComment, myInfo.username, id, myInfo.id,)
    }
  };


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
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex' }}>
              <img
                className="user-icon-small"
                alt="User avatar"
                src={profileImage(comments.userId)}
              />
              <div className="padding">
                <IonCard
                  style={{ border: `1px solid ${getColor(comments?.vote)}`, boxShadow: 'none', borderBottomLeftRadius: '0px' }}
                >
                  <div style={{ width: "95%", padding: "3px" }}>
                    <div className="rowUserNoSpace">

                      <div className="userName">{comments?.username}</div>
                    </div>
                    <div className="comment">{comments?.comment}</div>
                    <div
                      className="reply"
                      onClick={() => handleReplyClick(comments?.id)}
                    >
                      Reply
                    </div>
                  </div>

                  <div className="voteRowSmall">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', width: '20%' }}>
                      <IonIcon
                        style={{ color: 'black' }}
                        onClick={() => addCommentLike(myInfo.id, comments.id)}
                        icon={
                          isLikedByUser(comments?.likes)
                            ? arrowUpCircle
                            : arrowUpCircleOutline
                        }
                      ></IonIcon>
                      <div className="small" style={{ color: 'black' }}>
                        {calculateNetScore(comments?.likes, comments?.dislikes)}
                      </div>
                      <IonIcon
                        style={{ color: 'black' }}
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
        {isReplying && (
          <IonFooter className="message-input-container">
            <IonTextarea
              onBlur={() => { setIsReplying(false) }}
              ref={inputRef}
              // onKeyDown={}              
              value={replyComment}
              onIonChange={(e) => setReplyComment(e.detail.value!)}
              placeholder="Type your reply..."
            />
            <IonIcon style={{ marginLeft: '3px', padding: '5px' }} size="large" icon={sendOutline} onMouseDown={(e) => e.preventDefault()} onClick={() => {
              addComment(
                replyComment,
                myInfo?.username,
                postId,
                myInfo?.id,
                id,
                myVote,)
            }} />
          </IonFooter>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Comment;
