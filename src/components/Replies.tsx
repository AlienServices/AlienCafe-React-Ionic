import { useState, useEffect, useContext } from "react";
import { IonButton, IonItem, IonCard, IonList, IonIcon } from "@ionic/react";
import { MyContext } from "../providers/postProvider";
import { sendOutline } from "ionicons/icons";

interface Comment {
  id: string;
  parentId: string | null;
  comment: string;
  username: string;
}

interface RepliesProps {
  id: string;
}

const Replies: React.FC<RepliesProps> = ({ id }) => {
  const { myInfo } = useContext(MyContext);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState<string>('');
  const [replyComment, setReplyComment] = useState<string>('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyToggle, setReplyToggle] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    getOneConvo();
  }, []);

  const getOneConvo = async () => {
    try {
      const result = await fetch(
        `http://localhost:3000/api/getComments?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const post = await result.json();
      setComments(post.comment as Comment[]);
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  const AddComment = async (comment: string, userName: string, postId: string, userId: string, commentId: string | null) => {
    try {
      const result = await fetch(
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
          }),
        }
      );
      const post = await result.json();
      setComments(post.comments as Comment[]);
      setComment(''); // Clear the input after posting
      setReplyingTo(null); // Reset the reply input after posting
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  const handleReplyClick = (commentId: string) => {
    setReplyingTo(prevId => (prevId === commentId ? null : commentId));
  };

  const getParentComment = (parentId: string | null) => {
    if (!parentId) return null;
    const parentComment = comments.find(comment => comment.id === parentId);
    return parentComment ? { username: parentComment.username, comment: parentComment.comment } : null;
  };

  const renderReplies = (commentId: string, nestedDepth = 0) => {
    return (
      <>
        {comments.filter(reply => reply.parentId === commentId).map(reply => {
          const parentInfo = getParentComment(reply.parentId);
          return (
            <div className="columnCommentWide" key={reply.id}>
              <IonCard className="cardComment">
                <div style={{ width: '95%' }}>
                  <div className="userName">{reply.username}</div>
                  {parentInfo && (
                    <div className="parentInfo">
                      <div className="parentUsername">{parentInfo.username}</div>
                      <div className="parentComment">{parentInfo.comment}</div>
                    </div>
                  )}
                  <div className="comment">{reply.comment}</div>
                  <div className="reply" onClick={() => handleReplyClick(reply.id)}>
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
                        style={{ marginTop: '20px' }}
                        className="noPadding"
                        onClick={() => AddComment(replyComment, myInfo.username, id, myInfo.id, reply.id)}
                      >
                        send
                      </button>
                    </div>
                  )}
                  {/* {comments.some(r => r.parentId === reply.id) && (
                    <div className="seeMore" onClick={() => toggleReplies(reply.id)}>
                      {replyToggle[reply.id] ? "- Hide Replies" : "+ See More"}
                    </div>
                  )} */}
                </div>
              </IonCard>

              {replyToggle[reply.id] && renderReplies(reply.id, nestedDepth + 1)}
            </div>
          );
        })}
      </>
    );
  };

  const toggleReplies = (commentId: string) => {
    const shouldHide = replyToggle[commentId];

    const hideNestedReplies = (id: string) => {
      comments
        .filter(comment => comment.parentId === id)
        .forEach(comment => {
          setReplyToggle(prevState => ({
            ...prevState,
            [comment.id]: false,
          }));
          hideNestedReplies(comment.id);
        });
    };

    setReplyToggle(prevState => ({
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
          className="input"
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add Comment"
          value={comment}
        />
        <button className="noPadding" onClick={() => AddComment(comment, myInfo.username, id, myInfo.id, null)}>
          <IonIcon icon={sendOutline}></IonIcon>
        </button>
      </div>
      <div className="commentColumn">
        {comments
          .filter(comment => comment.parentId === null)
          .map(comment => (
            <div key={comment.id} className="commentRow">
              <div className="bottomImage">
                <img
                  className="user-icon-small"
                  alt="User avatar"
                  src="https://ionicframework.com/docs/img/demos/avatar.svg"
                />
              </div>
              <div className="columnWide">
                <IonCard className="cardComment">
                  <div>
                    <div className="rowUser">
                      <div className="userName">{comment.username}</div>
                      <div className="dot"></div>
                    </div>
                    <div className="comment">{comment.comment}</div>
                    <div className="reply" onClick={() => handleReplyClick(comment.id)}>
                      Reply
                    </div>
                  </div>
                </IonCard>

                {replyingTo === comment.id && (
                  <div className="replyInput">
                    <input
                      className="inputReply"
                      onChange={(e) => setReplyComment(e.target.value)}
                      placeholder="Reply..."
                    />
                    <button
                      className="noPadding"
                      onClick={() => AddComment(replyComment, myInfo.username, id, myInfo.id, comment.id)}
                    >
                      Send
                    </button>
                  </div>
                )}

                {replyToggle[comment.id] && renderReplies(comment.id)}

                {comments.some(reply => reply.parentId === comment.id) && (
                  <div className="seeMore" onClick={() => toggleReplies(comment.id)}>
                    {replyToggle[comment.id] ? "- Hide Replies" : "+ See All Replies"}
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default Replies;