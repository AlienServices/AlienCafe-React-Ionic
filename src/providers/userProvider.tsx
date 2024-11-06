import { createContext, useState, ReactNode, useEffect } from "react";
import { post } from "../utils/fetch";
import { Platform } from "react-native";
import { Capacitor } from "@capacitor/core";
import { supabase } from "../components/supaBase";

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
    setUser: () => {},
    myInfo: {
        id: "",
        content: "",
        likes: [],
        email: "",
        bio: "",
        username: "",
        following: [],
        followers: [],
        blurhash: ""
    },
    setMyInfo: () => {},
    updateUser: () => {},
    loggedIn: false,
    setLoggedIn: () => {}
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [myInfo, setMyInfo] = useState<UserContext["myInfo"] | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (loggedIn) {
            userInfo();
        }
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
                }
            );
            const posts = await result.json();
            setMyInfo(posts.Hello);
        } catch (error) {
            console.log(error, "this is the create user error");
        }
    };

    const updateUser = async (
        userEmail: string,
        followUserEmail: string,
        bio: string
    ) => {
        try {
            await post({
                url: `http://localhost:3000/api/updateUsers`,
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
                setLoggedIn
            }}
        >
            {children}
        </UserContext.Provider>
    );
};