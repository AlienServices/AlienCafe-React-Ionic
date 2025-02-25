import { createContext, useState, ReactNode, useEffect } from "react";
import { post } from "../utils/fetch";
import { Capacitor } from "@capacitor/core";

interface User {
  id: string;
  email: string;
  username: string;
}

interface UserInfo {
  id: string;
  content: string;
  likes: string[];
  email: string;
  bio: string;
  username: string;
  following: string[];
  followers: string[];
  blurhash: string;
}

interface UserContext {
  user: User | null;
  setUser: (user: User | null) => void;
  myInfo: UserInfo | null;
  setMyInfo: (user: UserInfo | null) => void;
  updateUser: (userEmail: string, followUserEmail: string, bio: string) => void;
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
}

export const UserContext = createContext<UserContext>({
  user: null,
  setUser: () => { },
  myInfo: null,
  setMyInfo: () => { },
  updateUser: () => { },
  loggedIn: false,
  setLoggedIn: () => { },
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [myInfo, setMyInfo] = useState<UserInfo | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const getBaseUrl = () => {
    const platform = Capacitor.getPlatform();
    const isLocalDevelopment =
      window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

    if (platform === "web" && isLocalDevelopment) {
      return import.meta.env.VITE_APP_LOCAL_SERVER_BASE_URL; // Local development URL
    }
    return import.meta.env.VITE_APP_SERVER_BASE_URL; // Production URL for web and mobile
  };

  useEffect(() => {
    if (loggedIn) userInfo();
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
        }
      );
      const data = await result.json();
      setMyInfo(data.user);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const updateUser = async (userEmail: string, followUserEmail: string, bio: string) => {
    try {
      await post({
        url: `${getBaseUrl()}/api/users/updateUsers`,
        body: { userEmail, followUserEmail, bio },
      });
      userInfo(); // Refresh user info after update
    } catch (err) {
      console.error("Error updating user:", err);
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