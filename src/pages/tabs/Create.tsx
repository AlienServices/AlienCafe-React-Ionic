import React, { useState, useEffect, useRef, useContext } from "react";
import ReactQuill from "react-quill";
import { useHistory } from "react-router";
import "react-quill/dist/quill.snow.css";
import "../../theme/create.css";
import {
  IonContent,
  IonPage,
  IonFooter,
  IonImg,
  useIonViewWillLeave,
} from "@ionic/react";
import Quiz from "../../subPages/Quiz";
import { UserContext } from "../../providers/userProvider";
import HeaderAlien from "../../components/preRender/Header";

const MyEditor = () => {
  const [editorHtmlTitle, setEditorHtmlTitle] = useState("");
  const [editorHtml, setEditorHtml] = useState("");
  // const inputRef = useRef<HTMLIonTextareaElement>(null);
  const [isReplying, setIsReplying] = useState(false);
  const history = useHistory();
  const { setLoggedIn, loggedIn, myInfo } = useContext(UserContext);
  const contentQuillRef = useRef<ReactQuill | null>(null);
  const titleQuillRef = useRef<ReactQuill | null>(null);
  

  useEffect(() => {
    if (contentQuillRef.current) {
      const quill = contentQuillRef.current.getEditor();
      quill.getModule("toolbar").container = document.querySelector("#toolbar");
    }
  }, []);

  const handleChange = (html: string) => {
    setEditorHtml(html);
  };

  const handleTitleChange = (html: string) => {
    setEditorHtmlTitle(html);
  };

  const profileImage = (id: string) => {
    if (id) {
      const newProfileImageUri = `${import.meta.env.VITE_APP_SUPABASE_URL}/storage/v1/object/public/ProfilePhotos/${id}.jpg`;
      return newProfileImageUri;
    }
  };

  const handleReplyClick = (e: boolean) => {
    setIsReplying(e);
    // setReplyingTo(commentId);
    setTimeout(() => {
      contentQuillRef.current?.getEditor();
    }, 400);
  };

  const handleTitleReplyClick = (e: boolean) => {
    setIsReplying(e);
    setTimeout(() => {
      titleQuillRef.current?.getEditor();
    }, 400);
  };

  useIonViewWillLeave(() => {
    setEditorHtml("");
    setEditorHtmlTitle("");
  }, []);

  return (
    <IonPage>
      <HeaderAlien
        backArrowToggle={false}
        next={loggedIn? true : false}
        content={editorHtml}
        title={editorHtmlTitle}
      />
      <IonContent>
        {loggedIn ? (
          <div className="centerRow">
            <img
              className="profile-photo"
              src={profileImage(myInfo?.id || "")}
              alt=""
            />
            {myInfo?.username}
          </div>
        ) : (
          <div style={{width: '300px'}} className="centerRow">
            <img
              className="profile-photo"
              src={profileImage(
                "https://www.macrumors.com/how-to/create-guest-account-macos/",
              )}
              alt=""
            />
            You Need To Login
          </div>
        )}

        <div className="editorContainer">
          <div className="titleEditor">
            <ReactQuill
              className="custom-title-editor"
              onFocus={() => {
                handleTitleReplyClick(true);
              }}
              onBlur={() => {
                handleTitleReplyClick(false);
              }}
              ref={titleQuillRef}
              value={editorHtmlTitle}
              placeholder="Title/Thesis"
              onChange={handleTitleChange}
              modules={MyEditor.titleModules}
              formats={MyEditor.titleFormats}
            />
          </div>
          <div className="contentEditor">
            <ReactQuill
              onFocus={() => {
                handleReplyClick(true);
              }}
              onBlur={() => {
                handleReplyClick(false);
              }}
              className="custom-content-editor"
              ref={contentQuillRef}
              value={editorHtml}
              placeholder="Enter your supporting narrative, links to sources, and photos"
              onChange={handleChange}
              modules={MyEditor.modules}
              formats={MyEditor.formats}
            />
          </div>
        </div>
        <IonFooter className={isReplying ? "message-input-container" : "none"}>
          <div
            id="toolbar"
            style={{
              width: "100%",
              border: "none",
              background: "white",
              zIndex: 1000,
              display: isReplying ? "flex" : "none", // Controls visibility based on isReplying
              justifyContent: "space-between",
              padding: "10px",
            }}
          >
            <button className="ql-bold"></button>
            <button className="ql-underline"></button>
            <button className="ql-link"></button>
            <button className="ql-image"></button>
            <button className="ql-list" value="bullet"></button>
          </div>
        </IonFooter>
      </IonContent>
    </IonPage>
  );
};

MyEditor.titleModules = {
  toolbar: false,
  clipboard: {
    matchVisual: false,
  },
};

MyEditor.titleFormats = ["header"];

MyEditor.modules = {
  toolbar: {
    container: "#toolbar",
  },
};

MyEditor.formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "link",
  "image",
  "video",
  "code-block",
  "list",
  "bullet",
  "indent",
];

export default MyEditor;
