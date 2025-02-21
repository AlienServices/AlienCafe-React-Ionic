import { useContext, useEffect, useMemo, useState } from "react";
import { IonIcon, useIonViewDidEnter, useIonViewWillEnter, IonSpinner } from "@ionic/react";
import { useHistory } from "react-router";
import { IonAvatar, IonCard, IonList } from "@ionic/react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../theme/Tab3.css";
import { MyContext } from "../providers/postProvider";
import { book, trashOutline } from "ionicons/icons";
import { UserContext } from "../providers/userProvider";

const Content: React.FC = () => {
  const { myPosts, deletePost } = useContext(MyContext);
  const history = useHistory();
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getBaseUrl } = useContext(MyContext);
  const { myInfo, setMyInfo } = useContext(UserContext);

  useEffect(() => {
    if (myInfo) {
      getAllBookmarks(myInfo?.id)
    } else {
      setLoading(false)
    }
  }, [myInfo])


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

  const getAllBookmarks = async (userId: string) => {
    try {
      // 1️⃣ Fetch Bookmarked Post IDs First
      const response = await fetch(`${getBaseUrl()}/api/posts/getBookmark?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch bookmarks: ${response.status} ${response.statusText}`);
      }

      const bookmarkedIds = await response.json();
      const allBookmarks = [];
      const bookmarkDetails = await Promise.all(
        bookmarkedIds.bookmarks?.map(async (post: any) => {
          const bookmarkData = await getBookmarkData(post.postId);
          allBookmarks.push(bookmarkData.Posts);
          return bookmarkData;
        })
      );
      setLoading(false)
      setBookmarkedPosts(bookmarkDetails);
    } catch (error) {
      console.error("❌ Error fetching bookmarks:", error);
    }
  };

  const profileImageUri = (id: string) => {
    return `${import.meta.env.VITE_APP_SUPABASE_URL}/storage/v1/object/public/ProfilePhotos/${id}.jpg`;
  }



  const getBookmarkData = async (userId: string) => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/posts/getSpecificPost?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch bookmarks: ${response.status} ${response.statusText}`); ``
      }

      const posts = await response.json();
      console.log(posts, 'these are the getbookmarkdata posts')
      return posts
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };





  return (
    <IonList>
      <div>
        {loading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px' }}><IonSpinner></IonSpinner></div> : <>{bookmarkedPosts?.map((post: any, index: number) => {
          const transformedTitle = transformTitleToH1(post.posts[0].title);
          const truncatedContent = truncateContent(post.posts[0].content, 200);
          const date = new Date(post.posts[0].date);
          const month = String(date.getUTCMonth() + 1).padStart(2, "0");
          const day = String(date.getUTCDate()).padStart(2, "0");
          const year = date.getUTCFullYear();
          const formattedDate = `${month}/${day}/${year}`;

          return (
            <div className="shadow" key={post.posts[0].id}>
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
                        src={`${profileImageUri(post.posts[0].userId)}`}
                      />
                    </IonAvatar>
                    <div className="username">{post.posts[0].email}</div>
                  </div>
                </div>
                <div
                  onClick={() => {
                    gotoTopic(post.posts[0].id);
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

                    </div>
                  </div>
                </div>
              </IonCard>
            </div>
          );
        })}</>
        }
      </div>
    </IonList>
  );
};

export default Content;
