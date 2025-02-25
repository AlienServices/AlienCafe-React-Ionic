import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import Test from ".././Test";
import { IonContent, IonIcon, IonRouterLink, IonPage } from "@ionic/react";
import { addOutline } from "ionicons/icons";
import { motion } from "framer-motion";

import "../../theme/chat.css";
import "../../theme/swiper.css";
import "../../theme/test.css";
import "../../theme/styles.scss";
import "../../theme/Home.css";
import HeaderAlien from "../../components/preRender/Header";
import { MyContext } from "../../providers/postProvider";

interface MessageData {
  conversationId: string;
  date: string;
  id: string;
  message: string;
  status: string;
  userName: string;
  recipient?: string;
}

const MessageHome = () => {
  const [messageData, setMessageData] = useState<MessageData[]>([]);
  const [myConvos, setMyConvos] = useState<any>([]);
  const history = useHistory();
  const { getBaseUrl } = useContext(MyContext);
  const DELETE_BTN_WIDTH = 15;
  const MESSAGE_DELETE_ANIMATION = { height: 0, opacity: 0 };
  const MESSAGE_DELETE_TRANSITION = {
    opacity: {
      transition: {
        duration: 0,
      },
    },
  };

  const handleDragEnd = (info: any, messageId: string) => {
    const dragDistance = info.point.x;
    if (dragDistance < DELETE_BTN_WIDTH) {
      // deleteConvos(messageId);
    }
  };

  // useEffect(() => {
  //   getConvos();
  //   const intervalId = setInterval(getConvos, 1000);
  //   return () => clearInterval(intervalId);
  // }, []);

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
      console.log(error, "this is the create user error");
    }
  };

  const getConvoData = async () => {
    try {
      const result = await fetch(
        `${getBaseUrl()}/conversaions/getConvoData?ids=${myConvos?.map((convo: { id: string }) => convo.id)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const allData = await result.json();
      setMessageData(allData.Posts);
    } catch (error) {
      console.log(error, "this is an error");
    }
  };

  useEffect(() => {
    getConvoData();
  }, [myConvos]);

  const gotoTopic = () => {
    history.push("/login");
  };

  return (
    <IonPage>
      <HeaderAlien
        next={false}
        title={"null"}
        content={""}
        backArrowToggle={false}
      />
      <IonContent>
        <ul>
          <motion.li
            key={"props.id"}
            exit={MESSAGE_DELETE_ANIMATION}
            transition={MESSAGE_DELETE_TRANSITION}
          >
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) =>
                handleDragEnd(info, "props.conversationId")
              }
              className="msg-container"
            >
              {messageData?.map((convo, i) => {
                const lastMessageDate = new Date(convo.date);
                let hours = lastMessageDate.getHours();
                const minutes = String(lastMessageDate.getMinutes()).padStart(
                  2,
                  "0",
                );
                const ampm = hours >= 12 ? "PM" : "AM";
                hours = hours % 12 || 12; // Convert to 12-hour format
                const time = `${hours}:${minutes} ${ampm}`;

                return (
                  <Test
                    key={convo.conversationId}
                    time={time}
                    conversationId={convo.conversationId}
                    message={convo.message}
                    status={convo.status}
                    userName={convo.userName}
                    recipient={convo.recipient}
                  />
                );
              })}
            </motion.div>
          </motion.li>
        </ul>
        <div className="center">
          <div>Create A Conversation</div>
          <IonRouterLink routerLink="/newChat" routerDirection="forward">
            <IonIcon size="large" icon={addOutline}></IonIcon>
          </IonRouterLink>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MessageHome;
