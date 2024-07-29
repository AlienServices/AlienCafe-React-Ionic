import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import {
  arrowBackOutline,
  chatbubbleOutline,
  heartCircle,
  bookmarkOutline,
  shareOutline,
} from "ionicons/icons";
import "react-quill/dist/quill.snow.css";
import {
  IonButton,
  IonTextarea,
  IonAvatar,
  IonIcon,
  IonCard,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRouterLink,
  IonToolbar,
} from "@ionic/react";
import { post } from "../../utils/fetch";
import "../../theme/id.module.css";

const Post = () => {
  const [content, setContent] = useState([]);
  const [comments, setComments] = useState<string[]>([]);
  const [comment, setComment] = useState<string>("");
  const [value, setValue] = useState("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [hasVoted, setHasVoted] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    getOnePost();
  }, []);

  useEffect(() => {
    updateVote()
  }, [totalCount])

  const getOnePost = async () => {
    try {
      const result = await fetch(`http://localhost:3000/api/getPost?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const post = await result.json();
      setContent(post.Hello);
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  const handleOptionChange = (e: any) => {
    setSelectedOption(e.target.value);
  };

  const handleVote = () => {
    setHasVoted(true);
    setTimeout(() => {
      let updatedCount = totalCount;
      if (selectedOption === "yes") {
        updatedCount += 1;
      } else if (selectedOption === "no") {
        updatedCount -= 1;
      }
      setTotalCount(updatedCount);
      console.log("User has voted:", selectedOption);
    }, 500); // The delay should match the CSS transition duration
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

  const updateVote = async () => {
    const updateUser = await post({
      url: "http://localhost:3000/api/addVote",
      body: {
        vote: totalCount
      },
    });
  };

  console.log(totalCount, 'this is the total count')

  return (
    <IonPage>
      <IonContent>
        <IonHeader>
          <IonToolbar>
            <IonRouterLink href={`/tab1`}>
              <IonIcon size="large" icon={arrowBackOutline}></IonIcon>
            </IonRouterLink>
          </IonToolbar>
        </IonHeader>
        {content.map((post: any, index: number) => {
          const transformedTitle = transformTitleToH1(post.title);
          return (
            <div className="shadow" key={index}>
              <IonCard
                style={{
                  marginBottom: "25px",
                }}
                className="card"
              >
                <div className="around">
                  <div style={{ padding: "8px" }} className="emailContainer">
                    <IonAvatar
                      style={{
                        height: "20px",
                        width: "20px",
                        marginLeft: "10px",
                        marginRight: "5px",
                      }}
                    >
                      <img
                        alt="Silhouette of a person's head"
                        src="https://ionicframework.com/docs/img/demos/avatar.svg"
                      />
                    </IonAvatar>
                    <div className="username">{post?.email}</div>
                  </div>
                </div>
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
                  value={post?.content}
                />
              </IonCard>
            </div>
          );
        })}
        <div className={`quiz ${hasVoted ? 'slide-out' : ''}`}>
          <div className="centerThesis">
            <div className="question">{content[0]?.thesis}</div>
          </div>
          <div className="checkSpace">
            <input
              type="radio"
              value="yes"
              checked={selectedOption === "yes"}
              onChange={handleOptionChange}
            />
            <div className="answerWidth">Yes</div>
          </div>
          <div className="checkSpace">
            <input
              type="radio"
              value="no"
              checked={selectedOption === "no"}
              onChange={handleOptionChange}
            />
            <div className="answerWidth">No</div>
          </div>
          <div className="checkSpace">
            <input
              type="radio"
              value="maybe"
              checked={selectedOption === "maybe"}
              onChange={handleOptionChange}
            />
            <div className="answerWidth">Maybe</div>
          </div>
        </div>
        <div className={`${!hasVoted ? 'middle' : 'none'}`}>
          <IonButton onClick={handleVote}>Submit</IonButton>
        </div>
        <div className={`results ${hasVoted ? 'show-results' : ''}`}>
          <div>These are the results</div>
          <div>Total Count: {totalCount}</div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Post;