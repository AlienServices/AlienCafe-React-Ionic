import React, { useState, useEffect, useRef, useContext } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { sendOutline, returnUpBackOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import {
  IonHeader,
  IonItem,
  IonIcon,
  IonInput,
  IonRouterLink,
  IonButton,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import { MessageContext } from "../../providers/messageProvider";
import { post } from "../../utils/fetch";
import "../../theme/newChat.css";
import { MyContext } from "../../providers/postProvider";

type Message = {
  userName: string;
  message: string;
  date: Date;
};

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { getBaseUrl } = useContext(MyContext);
  const { myUsername } = useContext(MessageContext);
  const history = useHistory();
  const [recipient, setRecipient] = useState<string | undefined>();
  const [userName, setUserName] = useState<string | null>(
    localStorage.getItem("user"),
  );
  const [roomName, setRoomName] = useState<string>("");

  useEffect(() => {
    setRoomName(`${localStorage.getItem("user")}${recipient}`);
  }, [recipient]);

  useEffect(() => {
    if (messages.length === 1) {
      createConversation();
    }
  }, [messages]);

  useEffect(() => {}, []);

  const createConversation = async () => {
    const response = await post({
      url: `${getBaseUrl()}/comments/createConversation`,
      body: {
        messages: {
          message,
          userName,
          recipient,
        },
        me: localStorage.getItem("user"),
        roomName: `${localStorage.getItem("user")}${recipient}`,
        recipient,
      },
    });
    history.push(`/chat/${response.update.id}`);
    setMessage("");
    setRecipient("");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="flex">
            <IonRouterLink routerLink="/tab3" routerDirection="back">
              <IonIcon size="large" icon={returnUpBackOutline}></IonIcon>
            </IonRouterLink>
            <div className="centeredInputContainer">
              <IonInput
                className="inputCenter"
                onIonInput={(e) => {
                  setRecipient(e.detail.value as string);
                }}
                type="text"
                placeholder={"who to?"}
              ></IonInput>
            </div>
            <div></div>
          </div>
        </IonToolbar>
      </IonHeader>
      <div className="freshPage">
        <div className="column">
          {messages?.map((msg, i) => (
            <div
              key={i}
              className={` ${myUsername === msg.userName ? "end" : "start"}`}
            >
              <div
                className={`${
                  myUsername === msg.userName ? "centerEnd" : "centerBeginning"
                }`}
              >
                <div
                  className={`${
                    myUsername === msg.userName ? "blueEnd" : "grayEnd"
                  }`}
                >
                  {messages[i - 1]?.userName === msg.userName ? (
                    <></>
                  ) : (
                    <div className="user">{msg.userName}</div>
                  )}
                </div>
                <div
                  className={`message ${
                    myUsername === msg.userName ? "blue" : "gray"
                  } `}
                >
                  {msg.message}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="columnWhite">
          <div style={{ paddingBottom: "10px" }} className="flexTime">
            <IonItem style={{ width: "100%" }} lines="none">
              <textarea
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    createConversation();
                  }
                }}
                value={message}
                onChange={(e) => setMessage(e.target.value!)}
                className="something"
              ></textarea>
            </IonItem>
            <IonButton onClick={createConversation} size="small">
              <IonIcon icon={sendOutline}></IonIcon>
            </IonButton>
          </div>
        </div>
      </div>
    </IonPage>
  );
};

export default Chat;
