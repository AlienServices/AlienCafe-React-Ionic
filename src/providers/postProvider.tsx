import { createContext, useState, ReactNode, useEffect } from "react";
import { post } from "../utils/fetch";

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
  myInfo: {
    id: string;
    email: string;
    username: string;
    bio: string;
    following: [];
    followers: [];
  };
  setPosts: (post: Post[]) => void;
  setUserPosts: (post: Post[]) => void;
  setMyPosts: (post: Post[]) => void;
  setMyInfo: (user: {
    id: string;
    content: string;
    likes: string[];
    email: string;
    bio: string;
    username: string;
    following: [];
    followers: [];
  }) => void;
  updatePost: (post: Post) => void;
  deletePost: (id: string) => void;
  createPost: (title: string, value: string, thesis: string, yesAction: string, noAction: string, maybeAction: string, categories: string) => void;
  updateUser: (
    username: string,
    bio: string,
    following: string[],
    email: string,
  ) => void;
  getAllPosts: () => void;
  getUserPosts: (email: string) => void;
  setLoggedin: (value: boolean) => void;
  loggedIn: boolean;
}

// const MyContext = createContext({ values: [], setValues: (posts) => { } });
const MyContext = createContext<PostContext>({
  posts: [],
  myPosts: [],
  setPosts: (posts) => { },
  setMyPosts: (posts) => { },
  updatePost: (post) => { },
  deletePost: (id) => { },
  createPost: (value) => { },
  setMyInfo: () => { },
  getAllPosts: () => { },
  setLoggedin: () => { },
  loggedIn: false,
  myInfo: {
    id: "",
    email: "",
    bio: "",
    followers: [],
    following: [],
    username: "",
  },
  updateUser: () => { },
  setUserPosts: () => { },
  userPosts: [],
  getUserPosts: (email) => { },
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
  const [myInfo, setMyInfo] = useState<{
    id: string;
    content: string;
    likes: string[];
    email: string;
    bio: string;
    username: string;
    following: [];
    followers: [];
  }>({
    id: "",
    content: "",
    likes: [],
    email: "",
    bio: "",
    username: "",
    following: [],
    followers: [],
  });
  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    getAllPosts();
  }, [myPosts]);

  useEffect(() => {
    getMyPosts();
    getAllPosts();
    userInfo();
  }, [loggedIn]);

  const userInfo = async () => {
    try {
      const result = await fetch(
        `http://localhost:3000/api/myInfo?email=${localStorage.getItem("user")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const posts = await result.json();
      setMyInfo(posts.Hello);
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  const getAllPosts = async () => {
    try {
      const result = await fetch(`http://localhost:3000/api/getPosts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const posts = await result.json();
      setContent(posts.Posts.map((post: any) => ({
        ...post,
        date: new Date(post.date),
      })));
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  const updatePost = async ({ id, likes, content, email }: Post) => {
    console.log(likes, "these are the likes I need");
    const updatedPost = await post({
      url: `http://localhost:3000/api/addLike?id=${id}`,
      body: {
        likes: likes,
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
  const deletePost = async (id: string) => {
    const updatedPost = await post({
      url: `http://localhost:3000/api/updatePosts?id=${id}`,
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
        `http://localhost:3000/api/getMyPosts?email=${localStorage.getItem("user")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const posts = await result.json();
      setMyPosts(posts.Posts);
      getAllPosts();
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };
  const getUserPosts = async (email: string) => {
    console.log(email, "this is the email");
    try {
      const result = await fetch(
        `http://localhost:3000/api/getMyPosts?email=${email}`,
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

  const createPost = async (title: string, value: string, thesis: string, yesAction: string, noAction: string, maybeAction: string, categories: string) => {
    console.log(JSON.stringify({
      title,
      thesis,
      content: value,
      email: localStorage.getItem("user") || "",
      date: new Date(),
      yesAction,
      noAction,
      maybeAction,
      categories
    }))
    try {
      const test = await fetch("http://localhost:3000/api/createPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          thesis,
          content: value,
          email: localStorage.getItem("user"),
          date: new Date(),
          yesAction,
          noAction,
          maybeAction,
          categories
        }),
      });
      getAllPosts();
      getMyPosts();
      console.log(test, 'Post message')
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  const updateUser = async (
    username: string,
    bio: string,
    following: string[],
    email: string,
  ) => {
    try {
      const updateUser = await post({
        url: `http://localhost:3000/api/updateUsers?email=${email}`,
        body: {
          bio: bio,
          username: username,
          following: following,
        },
      });
      userInfo();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MyContext.Provider
      value={{
        posts: content,
        myPosts: myPosts,
        setPosts: setContent,
        setMyPosts: setMyPosts,
        updatePost: updatePost,
        deletePost,
        createPost,
        myInfo,
        setMyInfo,
        getAllPosts,
        setLoggedin: setLoggedIn,
        loggedIn,
        updateUser,
        userPosts,
        getUserPosts,
        setUserPosts,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export { ContextProvider, MyContext };
