import { useContext, useEffect, useState } from "react";
import { IonIcon } from "@ionic/react";
import { useHistory } from "react-router";
import { IonAvatar, IonCard, IonList, IonSpinner } from "@ionic/react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../theme/Tab3.css";
import { MyContext } from "../providers/postProvider";
import { trashOutline } from "ionicons/icons";
import { UserContext } from "../providers/userProvider";

const Content: React.FC = () => {
  const { deletePost, getBaseUrl } = useContext(MyContext);
  const [myPosts, setMyPosts] = useState<
    {
      id: string;
      content: string;
      likes: string[];
      email: string;
      date: Date;
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const history = useHistory();
  const { myInfo, setMyInfo } = useContext(UserContext);

  useEffect(() => {    
    if (myInfo) {
      getMyPosts()
    } else {
      setLoading(false)
    }
  }, [])

  const getMyPosts = async () => {
    try {
      const result = await fetch(
        `${getBaseUrl()}/api/posts/getMyPosts?email=${localStorage.getItem("user")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const posts = await result.json();
      setMyPosts(posts.Posts);
      setLoading(false)
    } catch (error) {
      console.log(error, "this is the create user error");
    }
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

  const truncateContent = (content: string, length: number) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    let textContent = doc.body.textContent || "";
    if (textContent.length > length) {
      textContent = textContent.substring(0, length) + "...";
    }
    return textContent;
  };

  const gotoTopic = (id: string) => {
    history.push(`/view/${id}`);
  };

  const groupPostsByCategory = (posts: any) => {
    return posts.reduce((groups: any, post: any) => {
      post.categories.forEach((category: any) => {
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(post);
      });
      return groups;
    }, {});
  };

  const groupedPosts = groupPostsByCategory(myPosts);

  console.log(myInfo, 'this is my info')

  return (
    <IonList>
      {loading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px' }}><IonSpinner></IonSpinner></div> : <></>

      }
      {Object.keys(groupedPosts).map((category) => (
        <div key={category}>
          <div className="MyPostsTitle">{category}</div>
          {groupedPosts[category]
            .sort((a: any, b: any) => Date.parse(b?.date) - Date.parse(a?.date))
            .map((post: any, index: number) => {
              const transformedTitle = transformTitleToH1(post.title);
              const truncatedContent = truncateContent(post.content, 200);
              const date = new Date(post.date);
              const month = String(date.getUTCMonth() + 1).padStart(2, "0");
              const day = String(date.getUTCDate()).padStart(2, "0");
              const year = date.getUTCFullYear();
              const formattedDate = `${month}/${day}/${year}`;

              return (
                <div className="shadow" key={post.id}>
                  <IonCard
                    style={{
                      boxShadow: "none",
                      borderRadius: "0px",
                      paddingTop: "10px",
                      paddingBottom: "10px",
                    }}
                    className="card"
                  >
                    <div className="around">
                      <div className="emailContainer">
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
                        <div className="username">{post.email}</div>
                      </div>
                      <div onClick={() => {
                        deletePost(post.id)
                      }}>
                        <IonIcon icon={trashOutline}></IonIcon>
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        gotoTopic(post.id);
                      }}
                    >
                      <ReactQuill
                        style={{ color: "black" }}
                        readOnly={true}
                        theme="bubble"
                        value={transformedTitle}
                      />
                      <ReactQuill
                        className="small"
                        readOnly={true}
                        theme="bubble"
                        value={truncatedContent}
                      />
                    </div>
                    <div className="around">
                      <div className="flex">
                        <div className="center">
                          {/* <div>{formattedDate}</div> */}
                        </div>
                      </div>
                    </div>
                  </IonCard>
                </div>
              );
            })}
        </div>
      ))}
    </IonList>
  );
};

export default Content;
