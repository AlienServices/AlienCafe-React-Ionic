import { useEffect, useState, useContext } from "react";
import {
  IonModal,
  IonButton,
  IonContent,
  IonList,
} from "@ionic/react";
import { useHistory } from "react-router";
import "react-quill/dist/quill.snow.css";
import { supabase } from "../supaBase";
import "../../theme/Tab3.css";
import { MyContext } from "../../providers/postProvider";
import Post from "../postComponents/Post";
import { UserContext } from "../../providers/userProvider";

interface CategoryProps {
  category: string;
  setToggle: (value: boolean) => void;
}

const Category: React.FC<CategoryProps> = ({
  category, setToggle
}: {
  category: string;
  setToggle: (value: boolean) => void;
}) => {
  const history = useHistory();
  const [posts, setPosts] = useState([]);
  const {
    myPosts,
  } = useContext(MyContext);
  const { myInfo, updateUser } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getPosts();
  }, [myPosts]);


  const getPosts = async () => {
    try {
      const result = await fetch(
        `http://10.1.10.233:3000/api/getPostCategory?category=${category}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const userInfo = await result.json();
      if (Array.isArray(userInfo)) {
        setPosts(userInfo);
      } else if (userInfo?.posts && Array.isArray(userInfo.posts)) {
        setPosts(userInfo.posts);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.log(error, "this is the create user error");
      setPosts([]);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  console.log(posts)

  return (
    <div style={{height: 'fit-content'}}>      
        {posts ? (
          <>
            {posts
              ?.sort((a, b) => Date.parse(b?.date) - Date.parse(a?.date))
              .map((post: any) => {
                console.log(post)                
                return (
                  <Post setToggle={setToggle} post={post} />
                );
              })}
          </>
        ) : (
          <>
            <div>You aint got no post{category}</div>
          </>
        )}      
    </div>
  );
};

export default Category;
