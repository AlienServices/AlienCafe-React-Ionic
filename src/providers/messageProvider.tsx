import { createContext, useState, ReactNode, useContext } from "react";
import { post } from "../utils/fetch";
import { MyContext } from "./postProvider";

interface Conversation {
  id: string;
  me: string;
  recipient: string;
  roomName: string;
  date: string;
}

interface ContextProps {
  myUsername: string | null;
  setMyUsername: (value: string | null) => void;
  person: string;
  setPerson: (value: string) => void;
  myConvos: Conversation[];
  getConvos: () => void;
  deleteConvos: (id: string) => void;
  addMessage: (
    id: string,
    conversationId: string,
    message: string,
    userName: string,
    status: string,
    recipient: string
  ) => void;
}

const MessageContext = createContext<ContextProps>({
  myUsername: localStorage.getItem("user"),
  setMyUsername: () => { },
  person: "",
  setPerson: () => { },
  myConvos: [],
  getConvos: () => { },
  deleteConvos: () => { },
  addMessage: () => { },
});

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [myUsername, setMyUsername] = useState<string | null>(localStorage.getItem("user"));
  const [person, setPerson] = useState<string>("");
  const [myConvos, setMyConvos] = useState<Conversation[]>([]);
  const { getBaseUrl } = useContext(MyContext);

  const getConvos = async () => {
    try {
      const response = await fetch(
        `${getBaseUrl()}/api/conversations/getConvos?email=${localStorage.getItem("user")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setMyConvos(data.Posts);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const deleteConvos = async (id: string) => {
    try {
      await fetch(`${getBaseUrl()}/api/conversations/deleteConvo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      getConvos(); // Refresh the conversation list
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const addMessage = async (
    id: string,
    conversationId: string,
    message: string,
    userName: string,
    status: string,
    recipient: string
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
      getConvos(); // Refresh the conversation list
    } catch (error) {
      console.error("Error adding message:", error);
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