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
  email: string;
  content: string;
  likes: string[];
  id: string;
  date: Date;
}

interface PostContext {
  posts: Post[];
  myPosts: Post[];
  userPosts: Post[];
  setPosts: (post: Post[]) => void;
  setUserPosts: (post: Post[]) => void;
  setMyPosts: (post: Post[]) => void;
  updatePost: (post: Post) => void;
  deletePost: (id: string) => void;
  createPost: (
    title: string,
    value: string,
    thesis: string,
    yesAction: string,
    noAction: string,
    maybeAction: string,
    categories: string,
    probablyYesAction: string,
    probablyNoAction: string,
    selectedSubOption: string,
  ) => void;
  getMyPosts: () => void;
  getUserPosts: (email: string) => void;
  setLoggedin: (value: boolean) => void;
  loggedIn: boolean;
  addLike: (id: string) => void; // Add addLike
  addDislike: (id: string) => void; // Add addDislike
  addBookmark: (userId: string, postId: string) => void;
  getBaseUrl: () => void;
}

// const MyContext = createContext({ values: [], setValues: (posts) => { } });
const MyContext = createContext<PostContext>({
  posts: [],
  myPosts: [],
  setPosts: (posts) => { },
  setMyPosts: (posts) => { },
  updatePost: (post) => { },
  addLike: (post) => { },
  addDislike: (post) => { },
  deletePost: (id) => { },
  createPost: (value) => { },
  getMyPosts: () => { },
  setLoggedin: () => { },
  loggedIn: false,
  setUserPosts: () => { },
  userPosts: [],
  getUserPosts: (email) => { },
  addBookmark: (userId, postId) => { }, // Placeholder function
  getBaseUrl: () => { },
});

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<
    {
      id: string;
      content: string;
      likes: string[];
      email: string;
      date: Date;
    }[]
  >([]);
  let realContent = content;
  const [myPosts, setMyPosts] = useState<
    {
      id: string;
      content: string;
      likes: string[];
      email: string;
      date: Date;
    }[]
  >([]);
  const [userPosts, setUserPosts] = useState<
    {
      id: string;
      content: string;
      likes: string[];
      email: string;
      date: Date;
    }[]
  >([]);

  const { loggedIn, setLoggedIn } = useContext(UserContext);
  const { myInfo } = useContext(UserContext);

  useEffect(() => {
    getSession();
  }, [myInfo]);

  // useEffect(() => {
  //   getAllPosts();
  // }, [myPosts]);

  // useEffect(() => {
  //   getMyPosts()
  // }, [loggedIn]);

  // useIonViewDidEnter(() => {
  //   getMyPosts()
  // }, [])

  const addBookmark = async (userId: string, postId: string) => {
    console.log("hitting add bookmark");
    try {
      const result = await fetch(`${getBaseUrl()}/posts/addBookmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          postId,
        }),
      });
      const posts = await result.json();
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  // const getAllPosts = async () => {
  //   try {
  //     const result = await fetch(`getBaseUrl()/api/getPosts`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const posts = await result.json();
  //     setContent(
  //       posts.Posts.map((post: any) => ({
  //         ...post,
  //         date: new Date(post.date),
  //       })),
  //     );
  //   } catch (error) {
  //     console.log(error, "this is the create user error");
  //   }
  // };

  const updatePost = async (updatedPost: Post) => {
    try {
      // Send the updated post data to your backend
      const result = await post({
        url: `${getBaseUrl()}/api/posts/updatePost?id=${updatedPost.id}`,
        body: updatedPost,
      });

      // Update the state with the updated post
      setContent((prevContent) =>
        prevContent.map((post) =>
          post.id === updatedPost.id ? result.update : post,
        ),
      );
      // getAllPosts(); // Optionally refresh myPosts
    } catch (error) {
      console.log(error, "Error updating post");
    }
  };

  const addLike = async (id: string) => {
    const updatedPost = await post({
      url: `${getBaseUrl()}/api/posts/addPostLike?id=${id}`,
      body: {
        id: id,
        userId: myInfo?.id,
      },
    });
    getMyPosts();
    setContent(
      realContent.map((post) =>
        post.id === updatedPost.update.id ? updatedPost.update : post,
      ),
    );
  };

  const addDislike = async (id: string) => {
    try {
      const dislikedPost = await post({
        url: `${getBaseUrl()}/api/posts/addPostDislike`,
        body: {
          id,
          userId: myInfo?.id,
        },
      });
      getMyPosts();
    } catch (error) {
      console.error("Error adding dislike:", error); // Log any errors
    }
  };

  const deletePost = async (id: string) => {
    const updatedPost = await post({
      url: `${getBaseUrl()}/api/posts/updatePosts?id=${id}`,
      body: {
        content: content,
      },
    });
    getMyPosts();
    setContent(
      realContent.map((post) =>
        post.id === updatedPost.update.id ? updatedPost.update : post,
      ),
    );
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
        },
      );
      const posts = await result.json();
      setMyPosts(posts.Posts);
      // getAllPosts();
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  const getUserPosts = async (email: string) => {
    console.log(email, "this is the email");
    try {
      const result = await fetch(
        `${getBaseUrl()}/posts/getMyPosts?email=${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const posts = await result.json();
      setUserPosts(posts.Posts);
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  const getBaseUrl = () => {
    const platform = Capacitor.getPlatform();
    // if (platform === "web") {      
    //   if (
    //     window.location.hostname === "localhost" ||
    //     window.location.hostname === "127.0.0.1"
    //   ) {        
    //     return import.meta.env.VITE_APP_LOCAL_SERVER_BASE_URL; 
    //   } else {                
    //     return import.meta.env.VITE_APP_SERVER_BASE_URL; 
    //   }
    // } else {      
    //   return import.meta.env.VITE_APP_SERVER_BASE_URL; 
    // }
    return import.meta.env.VITE_APP_SERVER_BASE_URL;
  };

  const createPost = async (
    title: string,
    value: string,
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
      const test = await fetch(`${getBaseUrl()}/api/posts/createPost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          thesis,
          content: value,
          email: localStorage.getItem("user"),
          owner: myInfo?.id,
          date: new Date(),
          yesAction,
          noAction,
          probablyYesAction,
          probablyNoAction,
          maybeAction,
          categories,
          subCategory
        }),
      });
      // await getAllPosts();
      await getMyPosts();
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  async function getSession() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.log("Error fetching session:", error);
        setLoggedIn(false);
        localStorage.removeItem("user");
        return null;
      }
      setLoggedIn(true);
      if (data) {
        // getUser();
      }
      return data;
    } catch (err) {
      console.error("Unexpected error:", err);
      return null;
    }
  }



  return (
    <MyContext.Provider
      value={{
        posts: content,
        myPosts: myPosts,
        setPosts: setContent,
        setMyPosts: setMyPosts,
        updatePost: updatePost,
        addLike: addLike,
        addDislike: addDislike,
        deletePost: deletePost,
        createPost: createPost,
        getMyPosts: getMyPosts,
        setLoggedin: setLoggedIn,
        loggedIn: loggedIn,
        userPosts: userPosts,
        getUserPosts: getUserPosts,
        setUserPosts: setUserPosts,
        addBookmark: addBookmark,
        getBaseUrl: getBaseUrl,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export { ContextProvider, MyContext };
