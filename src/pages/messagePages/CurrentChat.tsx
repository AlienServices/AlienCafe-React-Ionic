import { useState, useRef, useContext } from "react";
import React, { useEffect } from "react";
import supabase from "../../messageComponents/supabaseClient";
import { createId } from "@paralleldrive/cuid2";
import { sendOutline, returnUpBackOutline } from "ionicons/icons";
import "../../theme/chat.css";
import { Keyboard } from "@capacitor/keyboard";
import { MyContext } from "../../providers/postProvider";
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonButton,
  IonRouterLink,
  IonPage,
  IonTitle,
  IonToolbar,
  IonTextarea,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import { MessageContext } from "../../providers/messageProvider";

type MessageStatus = "Delivered" | "Read";

interface Message {
  id: string;
  userName: string;
  message: string;
  status: MessageStatus;
}

interface ConvoInfo {
  id: string;
  users: [];
  me: string;
  message: { userName: string; message: string }[];
  recipient: string;
}

const CurrentChat: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const channel = useRef<any>(null);
  const { getBaseUrl } = useContext(MyContext);
  const { id } = useParams<{ id: string }>();
  const { myUsername, addMessage, myConvos } = useContext(MessageContext);
  const [userName, setUserName] = useState<string | null>(localStorage.getItem("user"));
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [info, setInfo] = useState<ConvoInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const index = myConvos.findIndex((item) => item.id == id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

  const updatedMessage = async (id: string, status: MessageStatus) => {
    try {
      const convos = await fetch(
        `getBaseUrl()/api/conversations/updateMessage`,
        {
          method: "POST",
          body: JSON.stringify({
            id,
            status,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const thisConvo = await convos.json();
      await getConvo();
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };



  const updateMessagesRead = async (id: string) => {
    try {
      const convos = await fetch(
        `${getBaseUrl()}/api/conversations/updateMessageRead?`,
        {
          method: "POST",
          body: JSON.stringify({
            conversationId: id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const thisConvo = await convos.json();
      await getConvo();
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  useEffect(() => {
    if (!channel.current) {
      channel.current = supabase.channel(myConvos[index]?.roomName, {
        config: {
          broadcast: {
            self: true,
          },
        },
      });
      channel.current
        .on("broadcast", { event: "message" }, ({ payload }: any) => {
          payload.message.date = new Date();
          payload.message.status = "Delivered";
          setMessages((prevMessages) => [...prevMessages, payload.message]);
          if (payload.message.userName !== myUsername) {
            updatedMessage(payload.message.id, "Read");
          }
        })
        .subscribe();
    }
    return () => {
      channel.current?.unsubscribe();
      channel.current = null;
    };
  }, [myConvos, index, myUsername]);

  const onSend = () => {
    if (
      messages[messages.length - 1]?.status === "Delivered" &&
      myUsername !== messages[messages.length - 1]?.userName
    ) {
      const lastMessageIndex = messages.length - 1;
      const result = messages.map((msg, i) => {
        if (i === lastMessageIndex) {
          return {
            ...msg,
            status: "Read",
          };
        }
        return msg;
      });
      // @ts-ignore
      setMessages(result);
    }
    const messageId = createId();
    if (!channel.current || message.trim().length === 0) return;
    if (userName && info) {
      const recipient =
        myUsername === info.recipient ? info.me : info.recipient;
      addMessage(messageId, id, message, userName, "Delivered", recipient);
    }
    channel.current.send({
      type: "broadcast",
      event: "message",
      payload: { message: { message, userName, id: messageId } },
    });

    setMessage("");
  };

  useEffect(() => {
    if (channel.current) {
      getConvo();
      getConvoDetails();
    }
  }, [channel]);

  useEffect(() => {
    if (
      messages[messages.length - 1]?.status === "Delivered" ||
      myUsername !== messages[messages.length - 1]?.userName
    ) {
      onSend();
    }
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (
      messages.length > 0 &&
      messages[messages.length - 1]?.userName !== myUsername &&
      messages[messages.length - 1]?.status === "Delivered"
    ) {
      updateMessagesRead(id);
    }
  }, [messages]);

  const getConvo = async () => {
    try {
      const convos = await fetch(
        `${getBaseUrl()}/api/conversations/getConvo?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const thisConvo = await convos.json();
      setMessages(thisConvo.Posts);
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  const getConvoDetails = async () => {
    try {
      const convos = await fetch(
        `${getBaseUrl()}/api/conversations/getSingleConvo?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const thisConvo = await convos.json();
      setInfo(thisConvo.Posts);
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="flex">
            <IonRouterLink
              className="clickable"
              routerLink="/tab3"
              routerDirection="back"
            >
              <IonIcon size="large" icon={returnUpBackOutline}></IonIcon>
            </IonRouterLink>
            <div className="centeredInputContainer">
              <IonTitle>
                {localStorage.getItem("user") === info?.me
                  ? info?.recipient
                  : info?.me}
              </IonTitle>
            </div>
            <div>...</div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="page">
          <div className="column">
            {messages?.map((msg, i) => (
              <div
                key={`${msg.id}-${myUsername}-${i}`}
                className={` ${userName === msg.userName ? "end" : "start"}`}
              >
                <div
                  className={`${userName === msg.userName ? "centerEnd" : "centerBeginning"
                    }`}
                >
                  <div
                    className={`message ${userName === msg.userName ? "blue" : "gray"
                      }`}
                  >
                    {msg.message}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            <div
              className={
                messages[messages.length - 1]?.userName !== myUsername
                  ? "none"
                  : "end"
              }
              style={{ paddingRight: "15px" }}
            >
              {messages[messages.length - 1]?.status === "Delivered" ? (
                <div className="smallGray">Delivered</div>
              ) : (
                <div className="smallGray">Read</div>
              )}
            </div>
          </div>
        </div>
      </IonContent>
      <div className="columnWhite">
        <div style={{ paddingBottom: "10px" }} className="flexTime">
          <IonItem style={{ width: "100%" }} lines="none">
            <textarea
              onClick={() => {
                Keyboard.addListener("keyboardWillShow", (info) => { });
              }}
              inputMode="text"
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  onSend();
                  setMessage("");
                }
              }}
              value={message}
              onChange={(e) => setMessage(e.target.value!)}
              className="something"
            ></textarea>
          </IonItem>
          <IonButton onClick={onSend} size="small">
            <IonIcon icon={sendOutline}></IonIcon>
          </IonButton>
        </div>
      </div>
    </IonPage>
  );
};

export default CurrentChat;
