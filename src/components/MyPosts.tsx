import { useEffect, useState, useContext } from "react";
import { IonIcon } from "@ionic/react";
import { useLocation, useHistory } from "react-router";
import { IonButton, IonAvatar, IonCard, IonList, IonPage } from "@ionic/react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../theme/Tab3.css";
import { MyContext } from "../providers/postProvider";
import { trashOutline } from "ionicons/icons";

const Content: React.FC = () => {
  const { myPosts, deletePost } = useContext(MyContext);
  const history = useHistory();

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

  const groupPostsByCategory = (posts) => {
    return posts.reduce((groups, post) => {
      post.categories.forEach((category) => {
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(post);
      });
      return groups;
    }, {});
  };

  const groupedPosts = groupPostsByCategory(myPosts);

  return (
    <IonList>
      {Object.keys(groupedPosts).map((category) => (
        <div key={category}>
          <div className="MyPostsTitle">{category}</div>
          {groupedPosts[category]
            .sort((a, b) => Date.parse(b?.date) - Date.parse(a?.date))
            .map((post, index) => {
              const transformedTitle = transformTitleToH1(post.title);
              const truncatedContent = truncateContent(post.content, 200);
              const date = new Date(post.date);
              const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
              const day = String(date.getUTCDate()).padStart(2, "0");
              const year = date.getUTCFullYear();

              // Format the date as mm/dd/yyyy
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
