import { createContext, useState, ReactNode, useContext } from "react";
import { post } from "../utils/fetch";
import { MyContext } from "./postProvider";

interface ContextProps {
  myUsername: string | null;
  setMyUsername: (value: string | null) => void;
  person: string;
  setPerson: (value: string) => void;
  myConvos: {
    id: string;
    me: string;
    recipient: string;
    roomName: string;
    date: string;
  }[];
  getConvos: () => void;
  deleteConvos: (id: string) => void;
  addMessage: (
    id: string,
    conversationId: string,
    message: string,
    userName: string,
    status: string,
    recipient: string,
  ) => void;
}

const MessageContext = createContext<ContextProps>({
  myUsername: localStorage.getItem("user"),
  setMyUsername: () => {},
  person: "",
  setPerson: () => {},
  myConvos: [],
  getConvos: () => {},
  deleteConvos: () => {},
  addMessage: () => {},
});

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [myUsername, setMyUsername] = useState<string | null>(
    localStorage.getItem("user"),
  );
  const [person, setPerson] = useState<string>("");
  const [myConvos, setMyConvos] = useState<any[]>([]);
  const [convoId, setConvoId] = useState<any[]>([]);
  const {getBaseUrl} = useContext(MyContext)

  const getConvos = async () => {
    try {
      const convos = await fetch(
        `${getBaseUrl()}/api/conversations/getConvos?email=${localStorage.getItem("user")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const userInfo = await convos.json();
      setMyConvos([...userInfo.Posts]);
    } catch (error) {
      console.log(error, "this is the get convos error");
    }
  };

  const deleteConvos = async (id: string) => {
    try {
      await fetch(`${getBaseUrl()}/api/conversations/deleteConvo`, {
        method: "POST",
        body: JSON.stringify({
          id: id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      getConvos();
    } catch (error) {
      console.log(error, "this is the delete convos error");
    }
  };

  const addMessage = async (
    id: string,
    conversationId: string,
    message: string,
    userName: string,
    status: string,
    recipient: string,
  ) => {
    try {
      await post({
        url: `${getBaseUrl()}/api/conversations/addMessage`,
        body: {
          id,
          messages: message,
          userName,
          conversationId,
          status,
          recipient,
        },
      });
      getConvos();
    } catch (error) {
      console.log(error, "this is the add message error");
    }
  };

  return (
    <MessageContext.Provider
      value={{
        myUsername,
        setMyUsername,
        person,
        setPerson,
        myConvos,
        getConvos,
        deleteConvos,
        addMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export { ContextProvider, MessageContext };
