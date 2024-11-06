import { useEffect, useState, useContext } from "react";
import {
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonAvatar,
  IonContent,
  IonCard,
  IonNavLink,
  IonList,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import { useLocation, useHistory } from "react-router";
import {
  heartCircle,
  chatbubbleOutline,
  bookmarkOutline,
  shareOutline,
  checkmarkCircleOutline,
  arrowDownCircleOutline,
  arrowUpCircleOutline,
  arrowUpCircle,
  arrowDownCircle,
} from "ionicons/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { supabase } from "../supaBase";
import "../../theme/Tab3.css";
import Page from "../../pages/View/[id]";
import Profile from "../../pages/Profile/[id]";
import { MyContext } from "../../providers/postProvider";
import moment from "moment";
import Post from "../postComponents/Post";
import { UserContext } from "../../providers/userProvider";

interface CategoryProps {
  category: string;
}

const Category: React.FC<CategoryProps> = ({
  category,
}: {
  category: string;
}) => {
  const history = useHistory();
  const [posts, setPosts] = useState([]);
  const {
    myPosts,
    setMyPosts,
    addLike,
    getAllPosts,    
    getUserPosts,
    addDislike,
    addBookmark
  } = useContext(MyContext);
  const { myInfo, updateUser } = useContext(UserContext);
  const [user, setUser] = useState({
    bio: "",
    email: "",
    followers: [],
    following: [],
    id: "",
    username: "",
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getPosts();
  }, [myPosts]);

  const getPosts = async () => {
    try {
      const result = await fetch(
        `http://localhost:3000/api/getPostCategory?category=${category}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const userInfo = await result.json();

      // Check if userInfo is an array and set posts accordingly
      if (Array.isArray(userInfo)) {
        setPosts(userInfo);
      } else if (userInfo?.posts && Array.isArray(userInfo.posts)) {
        setPosts(userInfo.posts);
      } else {
        setPosts([]); // Fallback to empty array if the response structure is unexpected
      }

      console.log(userInfo, "this is user result");
    } catch (error) {
      console.log(error, "this is the create user error");
      setPosts([]); // Fallback to empty array on error
    }
  };

  const handleLogout = async () => {
    console.log('hitting logout in category')
    try {
      const { error } = await supabase.auth.signOut();
      console.log("You Logged Out");
      if (error) {
        console.log("this is logout error", error);
      }
    } catch (error) {
      console.log(error);
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
    const doc = new DOMParser().parseFromString(content, "text/html");
    let text = doc.body.textContent || "";
    return (
      text.split(" ").slice(0, 20).join(" ") +
      (text.split(" ").length > 20 ? "..." : "")
    );
  };

  const gotoTopic = (id: string) => {
    history.push(`/view/${id}`);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    debugger;
    setShowModal(false);
  };

  const isLikedByUser = (likes: string[]): boolean => {
    // Check if the likes array includes your user ID
    return likes.includes(myInfo.id);
  };

  const isDislikedByUser = (dislikes: string[]): boolean => {
    // Check if the likes array includes your user ID
    return dislikes.includes(myInfo.id);
  };

  const calculateNetScore = (likes: string[], dislikes: string[]): number => {
    return likes.length - dislikes.length;
  };

  return (
    <IonContent >
      <IonList slot="fixed">
        {posts ? (
          <>
            {posts
              ?.sort((a, b) => Date.parse(b?.date) - Date.parse(a?.date))
              .map((post: any, index: number) => {
                const transformedTitle = transformTitleToH1(post.title);
                const truncatedContent = truncateContent(post.content, 400);

                const date = new Date(post.date);
                const month = String(date.getUTCMonth() + 1).padStart(2, "0");
                const day = String(date.getUTCDate()).padStart(2, "0");
                const year = date.getUTCFullYear();

                const formattedDate = `${month}/${day}/${year}`;

                return (
                  <Post post={post} />
                );
              })}
          </>
        ) : (
          <>
            <div>You aint got no post{category}</div>
          </>
        )}
      </IonList>

      <IonModal isOpen={showModal}>
        <IonButton slot="end">Close</IonButton>
        <button style={{ padding: "10px" }} onClick={closeModal}>
          close
        </button>
        <input style={{ color: "white" }} type="text" />
        <div>kale</div>
      </IonModal>
    </IonContent>
  );
};

export default Category;
