import { createContext, useState, ReactNode, useEffect } from "react";
import { post } from "../utils/fetch";
import { Capacitor } from "@capacitor/core";


interface User {
  id: string;
  email: string;
  username: string;
}

interface UserContext {
  user: User | null;
  setUser: (user: User | null) => void;
  myInfo: {
    id: string;
    content: string;
    likes: string[];
    email: string;
    bio: string;
    username: string;
    following: [];
    followers: [];
    blurhash: string;
  } | null;
  setMyInfo: (user: {
    id: string;
    content: string;
    likes: string[];
    email: string;
    bio: string;
    username: string;
    following: [];
    followers: [];
    blurhash: string;
  }) => void;
  updateUser: (userEmail: string, followUserEmail: string, bio: string) => void;
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
}

export const UserContext = createContext<UserContext>({
  user: null,
  setUser: () => { },
  myInfo: {
    id: "",
    content: "",
    likes: [],
    email: "",
    bio: "",
    username: "",
    following: [],
    followers: [],
    blurhash: "",
  },
  setMyInfo: () => { },
  updateUser: () => { },
  loggedIn: false,
  setLoggedIn: () => { },
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [myInfo, setMyInfo] = useState<UserContext["myInfo"] | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);


  const getBaseUrl = () => {
    const platform = Capacitor.getPlatform();
    if (platform === "web") {
      // Check if it's a local development environment
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ) {
        return import.meta.env.VITE_APP_LOCAL_SERVER_BASE_URL; // Local development URL
      } else {
        // Production environment for web
        return import.meta.env.VITE_APP_SERVER_BASE_URL; // Production URL for web
      }
    } else {
      // Native platforms (iOS/Android)
      return import.meta.env.VITE_APP_SERVER_BASE_URL; // URL for mobile
    }
  };

  useEffect(() => {
    userInfo();
  }, [loggedIn]);

  const userInfo = async () => {
    try {
      const result = await fetch(
        `${getBaseUrl()}/api/users/myInfo?email=${localStorage.getItem("user")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const myInfo = await result.json();      
      setMyInfo(myInfo.user);
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  const updateUser = async (
    userEmail: string,
    followUserEmail: string,
    bio: string,
  ) => {
    try {
      await post({
        url: `${getBaseUrl()}/api/users/updateUsers`,
        body: { userEmail, followUserEmail, bio },
      });
      userInfo();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        myInfo,
        setMyInfo,
        updateUser,
        loggedIn,
        setLoggedIn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
