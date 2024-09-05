import { useState, useEffect, useContext } from "react";
import { IonButton, IonItem, IonCard, IonList, IonIcon } from "@ionic/react";
import { MyContext } from "../providers/postProvider";
import { sendOutline, trashBin } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { IonNavLink } from "@ionic/react";
import Comment from "../pages/Comment/[id]";

interface Comment {
  id: string;
  parentId: string | null;
  comment: string;
  username: string;
  vote: string; // Assuming vote is a string field on the comment object
}

interface RepliesProps {
  postId: string;
  myVote: string;
}

const Replies: React.FC<RepliesProps> = ({ postId, myVote }) => {
  const { myInfo } = useContext(MyContext);
  const [comments, setComments] = useState<Comment[]>([]);
  const history = useHistory();
  const [comment, setComment] = useState<string>("");
  const [replyComment, setReplyComment] = useState<string>("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyToggle, setReplyToggle] = useState<{ [key: string]: boolean }>(
    {},
  );

  useEffect(() => {
    fetchComments();
  }, []);


  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/getComments?id=${postId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const post = await response.json();
      setComments(post.comment as Comment[]);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
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
      console.log(post, 'this is the post')
      setComments(post.comments as Comment[]);
      setComment("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error adding comment:", error);
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

  const handleReplyClick = (commentId: string) => {
    setReplyingTo((prevId) => (prevId === commentId ? null : commentId));
  };

  const getParentComment = (parentId: string | null) => {
    if (!parentId) return null;
    return comments.find((comment) => comment.id === parentId);
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

  const gotoTopic = (postId: string, id: string) => {
    console.log(postId, id)
    history.push(`/Comment/${id}/${myVote}/${postId}`);
  };


  const renderReplies = (commentId: string, nestedDepth = 0) => {
    return comments
      .filter((reply) => reply.parentId === commentId)
      .map((reply) => {
        const parentInfo = getParentComment(reply.parentId);
        const parentColor = parentInfo
          ? getColor(parentInfo.vote)
          : "transparent"; // Get the color of the parent comment

        return (
          <div
            key={reply.id}
            className={
              nestedDepth < 1 ? "columnCommentWide" : `columnCommentWideNo`
            }
          >
            <div className="rowReply">
              <div className="bottomImage">
                <img
                  className="user-icon-small"
                  alt="User avatar"
                  src="https://ionicframework.com/docs/img/demos/avatar.svg"
                />
              </div>

              <IonCard
                style={{
                  border: `2px solid ${getColor(reply.vote)}`,
                }}
                className={`${"cardComment"} ${getColor(reply.vote)}`}
              >
                <div style={{ width: "95%" }}>
                  <div className="rowUser">
                    <div className="userName">{reply.username}</div>
                    {myInfo?.username === reply.username && (
                      <button onClick={() => deleteComment(reply.id)}>
                        <IonIcon icon={trashBin}></IonIcon>
                      </button>
                    )}
                  </div>

                  {parentInfo && (
                    <div
                      style={{ borderLeft: `4px solid ${parentColor}` }}
                      className="parentInfo"
                    >
                      <div className="parentUsername">
                        {parentInfo.username}
                      </div>
                      <div className="parentComment">{parentInfo.comment}</div>
                    </div>
                  )}
                  <div style={{ width: '100%' }} onClick={() => { gotoTopic(postId, reply.id) }}>
                    <div className="comment">{reply.comment}</div>
                  </div>
                  <div
                    className="reply"
                    onClick={() => handleReplyClick(reply.id)}
                  >
                    Reply
                  </div>
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
                  {comments.some((r) => r.parentId === reply.id) && (
                    <div
                      className="seeMore"
                      onClick={() => toggleReplies(reply.id)}
                    >
                      {replyToggle[reply.id] ? "" : "+ See More"}
                    </div>
                  )}
                </div>
              </IonCard>

            </div>
            {replyToggle[reply.id] && renderReplies(reply.id, nestedDepth + 1)}
          </div>
        );
      });
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

  return (
    <>
      <div className="rowWide">
        <input
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
            addComment(comment, myInfo?.username, postId, myInfo?.id, null, myVote)
          }
        >
          <IonIcon icon={sendOutline}></IonIcon>
        </button>
      </div>

      {comments
        ?.filter((comment) => comment.parentId === null)
        .map((comment) => (
          <div className="commentColumn" key={comment.id}>
            <div className="commentRow">
              <div className="bottomImage">
                <img
                  className="user-icon-small"
                  alt="User avatar"
                  src="https://ionicframework.com/docs/img/demos/avatar.svg"
                />
              </div>
              <div className="columnWide">

                <IonCard
                  className={`${"cardComment"}`}
                  style={{ border: `2px solid ${getColor(comment.vote)}` }}
                >
                  <div style={{ width: "95%", padding: "3px" }}>
                    <div className="rowUser">
                      <div className="userName">{comment.username}</div>
                      {myInfo?.username === comment.username && (
                        <button onClick={() => deleteComment(comment.id)}>
                          <IonIcon icon={trashBin}></IonIcon>
                        </button>
                      )}
                    </div>
                    <div style={{ width: '100%' }} onClick={() => { gotoTopic(postId, comment.id) }}>
                      <div className="comment">{comment.comment}</div>
                    </div>
                    <div
                      className="reply"
                      onClick={() => handleReplyClick(comment.id)}
                    >
                      Reply
                    </div>
                  </div>
                  {replyingTo === comment.id && (
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
                            id,
                            myInfo?.id,
                            comment.id,
                            myVote,
                          )
                        }
                      >
                        Send
                      </button>
                    </div>
                  )}
                </IonCard>
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
    </>
  );
};

export default Replies;
