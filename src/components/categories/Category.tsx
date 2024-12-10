import { useContext, useEffect, useState } from "react";
import { useIonViewWillEnter } from "@ionic/react";
import "react-quill/dist/quill.snow.css";
import "../../theme/Tab3.css";
import Post from "../postComponents/Post";
import { MyContext } from "../../providers/postProvider";

interface PostType {
  id: string;
  email: string;
  title: string;
  content: string;
  category: string;
  date: string;
  likes: string[];
  userId: string;
  dislikes: string[];
  comments: any[]; 
  [key: string]: any;
}

interface CategoryProps {
  category: string;
  setToggle: (value: boolean) => void;
}

const Category: React.FC<CategoryProps> = ({ category, setToggle }) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const {getBaseUrl} = useContext(MyContext)
  const [showModal, setShowModal] = useState(false);

  useIonViewWillEnter(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const result = await fetch(
        `${getBaseUrl()}/api/posts/getPostCategory?category=${category}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const userInfo = await result.json();

      if (Array.isArray(userInfo)) {
        setPosts(userInfo as PostType[]);
      } else if (userInfo?.posts && Array.isArray(userInfo.posts)) {
        setPosts(userInfo.posts as PostType[]);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };


  return (
    <div style={{ height: "fit-content", minHeight: '75vh' }}>
      <div style={{display: 'flex', justifyContent: 'center', fontSize: '25px'}}>{category}</div>
      {posts.length > 0 ? (
        <>
          {posts
            .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
            .map((post) => (
              <Post key={post.id} setToggle={setToggle} post={post} />
            ))}
        </>
      ) : (
        <div style={{textAlign: 'center', marginTop: '20px'}}>No posts found here</div>
      )}
    </div>
  );
};

export default Category;
