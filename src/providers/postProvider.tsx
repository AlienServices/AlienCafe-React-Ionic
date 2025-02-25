import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
} from "react";
import { post } from "../utils/fetch";
import { Capacitor } from "@capacitor/core";
import { supabase } from "../components/supaBase";
import { UserContext } from "./userProvider";

interface Post {
  id: string;
  content: string;
  likes: string[];
  email: string;
  date: Date;
}

interface PostContext {
  posts: Post[];
  myPosts: Post[];
  userPosts: Post[];
  setPosts: (posts: Post[]) => void;
  setMyPosts: (posts: Post[]) => void;
  setUserPosts: (posts: Post[]) => void;
  updatePost: (post: Post) => void;
  deletePost: (id: string) => void;
  createPost: (
    title: string,
    content: string,
    links: string,
    thesis: string,
    yesAction: string,
    noAction: string,
    maybeAction: string,
    probablyYesAction: string,
    probablyNoAction: string,
    categories: string,
    subCategory: string
  ) => void;
  getMyPosts: () => void;
  getUserPosts: (email: string) => void;
  loggedIn: boolean;
  setLoggedin: (loggedIn: boolean) => void;
  addLike: (id: string) => void;
  addDislike: (id: string) => void;
  addBookmark: (userId: string, postId: string) => void;
  getBaseUrl: () => string;
}

const MyContext = createContext<PostContext>({
  posts: [],
  myPosts: [],
  userPosts: [],
  setPosts: () => { },
  setMyPosts: () => { },
  setUserPosts: () => { },
  updatePost: () => { },
  deletePost: () => { },
  createPost: () => { },
  getMyPosts: () => { },
  getUserPosts: () => { },
  loggedIn: false,
  setLoggedin: () => { },
  addLike: () => { },
  addDislike: () => { },
  addBookmark: () => { },
  getBaseUrl: () => "",
});

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const { loggedIn, setLoggedIn, myInfo } = useContext(UserContext);

  useEffect(() => {
    getSession();
  }, [myInfo]);

  const getBaseUrl = () => {
    const platform = Capacitor.getPlatform();
    return import.meta.env.VITE_APP_SERVER_BASE_URL;
  };

  const addBookmark = async (userId: string, postId: string) => {
    try {
      await fetch(`${getBaseUrl()}/api/posts/addBookmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, postId }),
      });
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  };

  const updatePost = async (updatedPost: Post) => {
    try {
      const result = await post({
        url: `${getBaseUrl()}/api/posts/updatePost?id=${updatedPost.id}`,
        body: updatedPost,
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === updatedPost.id ? result.update : post
        )
      );
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const addLike = async (id: string) => {
    try {
      const updatedPost = await post({
        url: `${getBaseUrl()}/api/posts/addPostLike?id=${id}`,
        body: { id, userId: myInfo?.id },
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === updatedPost.update.id ? updatedPost.update : post
        )
      );
      getMyPosts();
    } catch (error) {
      console.error("Error adding like:", error);
    }
  };

  const addDislike = async (id: string) => {
    try {
      await post({
        url: `${getBaseUrl()}/api/posts/addPostDislike`,
        body: { id, userId: myInfo?.id },
      });
      getMyPosts();
    } catch (error) {
      console.error("Error adding dislike:", error);
    }
  };

  const deletePost = async (id: string) => {
    try {
      await post({
        url: `${getBaseUrl()}/api/posts/updatePosts?id=${id}`,
        body: { content: posts },
      });
      getMyPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const getMyPosts = async () => {
    try {
      const result = await fetch(
        `${getBaseUrl()}/api/posts/getMyPosts?email=${localStorage.getItem("user")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await result.json();
      setMyPosts(data.Posts);
    } catch (error) {
      console.error("Error fetching my posts:", error);
    }
  };

  const getUserPosts = async (email: string) => {
    try {
      const result = await fetch(
        `${getBaseUrl()}/posts/getMyPosts?email=${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await result.json();
      setUserPosts(data.Posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  const createPost = async (
    title: string,
    content: string,
    links: string,
    thesis: string,
    yesAction: string,
    noAction: string,
    maybeAction: string,
    probablyYesAction: string,
    probablyNoAction: string,
    categories: string,
    subCategory: string
  ) => {
    try {
      await fetch(`${getBaseUrl()}/api/posts/createPost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          thesis,
          links,
          content,
          email: localStorage.getItem("user"),
          owner: myInfo?.id,
          date: new Date(),
          yesAction,
          noAction,
          probablyYesAction,
          probablyNoAction,
          maybeAction,
          categories,
          subCategory,
        }),
      });
      getMyPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const getSession = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching session:", error);
        setLoggedIn(false);
        localStorage.removeItem("user");
        return;
      }
      setLoggedIn(true);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <MyContext.Provider
      value={{
        posts,
        myPosts,
        userPosts,
        setPosts,
        setMyPosts,
        setUserPosts,
        updatePost,
        deletePost,
        createPost,
        getMyPosts,
        getUserPosts,
        loggedIn,
        setLoggedin: setLoggedIn,
        addLike,
        addDislike,
        addBookmark,
        getBaseUrl,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export { ContextProvider, MyContext };