import { useEffect, useState, useContext } from "react";
import {
  useIonViewWillEnter
} from "@ionic/react";
import "react-quill/dist/quill.snow.css";
import "../../theme/Tab3.css";
import Post from "../postComponents/Post";

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
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);


  useIonViewWillEnter(() => {
    getPosts();
  }, []);


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

  console.log('test')

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
