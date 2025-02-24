import { useContext } from "react";
import { MyContext } from "../providers/postProvider";
export const useApi = () => {
  const {getBaseUrl} = useContext(MyContext)
  const createUser = async (email: string, username: string) => {
    try {
      const test = await fetch(`${getBaseUrl()}/api/users/createUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
        }),
      });      
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };
  return { createUser };
};
