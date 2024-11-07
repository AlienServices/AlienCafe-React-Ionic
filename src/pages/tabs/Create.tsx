import React, { useState, useEffect, useRef, useContext } from "react";
import ReactQuill from "react-quill";
import { MyContext } from "../../providers/postProvider";
import { useHistory } from "react-router";
import "react-quill/dist/quill.snow.css";
import "../../theme/create.css";
import {
  IonButton,
  IonText,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonNavLink,
  IonMenuButton,
  IonMenuToggle,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFooter,
  useIonToast,
  useIonLoading,
  IonMenu,
  IonImg,
} from "@ionic/react";
import { closeOutline, arrowBackCircleOutline } from "ionicons/icons";
import Quiz from "../../subPages/Quiz";
import { UserContext } from "../../providers/userProvider";

const MyEditor = () => {
  const [editorHtmlTitle, setEditorHtmlTitle] = useState("");
  const [editorHtml, setEditorHtml] = useState("");
  const inputRef = useRef<HTMLIonTextareaElement>(null);
  const [isReplying, setIsReplying] = useState(false);

  const titleQuillRef = useRef(null);
  const history = useHistory();
  const {
    posts,
    myPosts,
    setPosts,
    setMyPosts,
    updatePost,
    getAllPosts,
    createPost,
  } = useContext(MyContext);
  const { myInfo } = useContext(UserContext);
  const contentQuillRef = useRef<ReactQuill | null>(null);

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

  const handleReplyClick = () => {
    setIsReplying(!isReplying);
    // setReplyingTo(commentId);
    setTimeout(() => {
      contentQuillRef.current?.getEditor();
    }, 400);
  };

  return (
    <IonPage>
      <div style={{ height: 'fit-content', zIndex: 1000 }} className="brown">
        <div style={{ top: '60px' }} className="logoContainer">
          <IonImg
            style={{ width: '60px', height: '60px' }}
            src="/AlienCafeLogo1.png"
          ></IonImg>
        </div>
        <IonNavLink
          routerDirection="forward"
          component={() => (
            <Quiz quizTitle={editorHtmlTitle} content={editorHtml} />
          )}
        >
          <button
            style={{ margin: '10px' }}
            className="nextButton"
            onClick={() => {
              setEditorHtml("");
              setEditorHtmlTitle("");
            }}
          >
            Next
          </button>
        </IonNavLink>
      </div>


      <IonContent>
        <div className="centerRow">
          <img
            className="profile-photo"
            src={profileImage(myInfo?.id)}
            alt=""
          />
          {myInfo?.username}
        </div>
        <div className="editorContainer">
          <div className="tagStart">Post Title</div>
          <div className="titleEditor">
            <ReactQuill
              className="custom-title-editor"
              ref={titleQuillRef}
              value={editorHtmlTitle}
              placeholder="Enter Title/Thesis/Question"
              onChange={handleTitleChange}
              modules={MyEditor.titleModules}
              formats={MyEditor.titleFormats}
            />
          </div>
          <div className="tagStart">Description</div>
          <div className="contentEditor">
            <ReactQuill
              onFocus={() => { handleReplyClick() }}
              onBlur={() => { handleReplyClick() }}
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
              width: "80%",
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
