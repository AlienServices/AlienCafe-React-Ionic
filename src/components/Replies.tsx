import { useState, useEffect, useContext } from "react";
import { IonButton, IonItem, IonCard, IonList } from "@ionic/react";
import { MyContext } from "../providers/postProvider";


const Replies = ({ id }: { id: string }) => {
  const { myInfo } = useContext(MyContext);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [replyComment, setReplyComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null); // State to track which comment is being replied to
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
      setComments(post.comment);
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  const AddComment = async (comment: string, userName: string, postId: string, userId: string, commentId: string) => {
    try {
      const result = await fetch(
        `http://localhost:3000/api/addComment?id=${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: comment,
            userName,
            postId,
            userId,
            commentId
          })
        }
      );
      const post = await result.json();
      setComments(post.comments);
      setComment(''); // Clear the input after posting
      setReplyingTo(null); // Reset the reply input after posting
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  const handleReplyClick = (commentId) => {
    setReplyingTo(prevId => (prevId === commentId ? null : commentId));
  };

  const renderReplies = (commentId, nestedDepth = 0) => {
    return comments
      .filter(reply => reply.parentId === commentId)
      .map(reply => (
        <div key={reply.id} className={nestedDepth < 4 ? "replyRow" : "replyColumn"}>
          <img
            className="user-icon-small"
            alt="User avatar"
            src="https://ionicframework.com/docs/img/demos/avatar.svg"
          />
          <div className="columnWide">
            <IonCard className="cardComment">
              <div>
                <div className="userName">{reply.username}</div>
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
                    <button style={{marginTop:'20px'}} className="noPadding" onClick={() => AddComment(replyComment, myInfo.username, id, myInfo.id, reply.id)}>
                      Send
                    </button>
                  </div>
                )}
                {comments.some(r => r.parentId === reply.id) && (
                  <div className="seeMore" onClick={() => toggleReplies(reply.id)}>
                    {replyToggle[reply.id] ? "- Hide Replies" : "+ See More"}
                  </div>
                )}
              </div>
            </IonCard>
            {replyToggle[reply.id] && renderReplies(reply.id, nestedDepth + 1)}
          </div>
        </div>
      ));
  };

  const toggleReplies = (commentId) => {
    const shouldHide = replyToggle[commentId];
    
    // Recursively hide all nested replies
    const hideNestedReplies = (id) => {
      comments
        .filter(comment => comment.parentId === id)
        .forEach(comment => {
          setReplyToggle(prevState => ({
            ...prevState,
            [comment.id]: false,
          }));
          hideNestedReplies(comment.id); // Recursively hide further nested replies
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
    <IonList>
      <div className="rowWide">
        <input
          className="input"
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add Comment"
          value={comment}
        />
        <IonButton onClick={() => AddComment(comment, myInfo.username, id, myInfo.id, null)}>
          Send
        </IonButton>
      </div>
      {comments
        .filter(comment => comment.parentId === null)
        .map(comment => (
          <IonItem key={comment.id} lines="none">
            <div className="commentRow">
              <img
                className="user-icon-small"
                alt="User avatar"
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
              />
              <div className="columnWide">
                <IonCard className="cardComment">
                  <div>
                    <div className="userName">{comment.username}</div>
                    <div className="comment">{comment.comment}</div>
                    <div className="reply" onClick={() => handleReplyClick(comment.id)}>
                      Reply
                    </div>
                    {comments.some(reply => reply.parentId === comment.id) && (
                      <div className="seeMore" onClick={() => toggleReplies(comment.id)}>
                        {replyToggle[comment.id] ? "- Hide Replies" : "+ See More"}
                      </div>
                    )}
                    {replyingTo === comment.id && (
                      <div className="replyInput">
                        <input
                          className="inputReply"
                          onChange={(e) => setReplyComment(e.target.value)}
                          placeholder="Reply..."
                        />
                        <button style={{marginTop:'20px'}} className="noPadding" onClick={() => AddComment(replyComment, myInfo.username, id, myInfo.id, comment.id)}>
                          Send
                        </button>
                      </div>
                    )}
                  </div>
                </IonCard>
                {replyToggle[comment.id] && renderReplies(comment.id)}
              </div>
            </div>
          </IonItem>
        ))}
    </IonList>
  );
};

export default Replies;