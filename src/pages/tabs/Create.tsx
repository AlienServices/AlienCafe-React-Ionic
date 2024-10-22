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
  useIonToast,
  useIonLoading,
  IonMenu,
  IonImg,
} from "@ionic/react";
import { closeOutline, arrowBackCircleOutline } from "ionicons/icons";
import Quiz from "../../subPages/Quiz";

const MyEditor = () => {
  const [editorHtmlTitle, setEditorHtmlTitle] = useState("");
  const [editorHtml, setEditorHtml] = useState("");

  const titleQuillRef = useRef(null);
  const history = useHistory();
  const {
    posts,
    myPosts,
    setPosts,
    setMyPosts,
    updatePost,
    getAllPosts,
    myInfo,
    createPost,
  } = useContext(MyContext);
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

  // useEffect(() => {
  //   debugger
  // }, [])

  return (
    <IonPage style={{ paddingTop: '10px' }}>
      <IonContent>
        <div className="brown">
          <div style={{
            borderRadius: '10px', backgroundColor: 'white', width: '45px', display: 'flex', justifyContent: 'center',
            height: '45px', alignItems: 'center', margin: '10px'
          }}>
            <IonIcon
              style={{
                fontSize: '28px',
                color: 'black',
              }}
              color="primary"
              icon={arrowBackCircleOutline}>
            </IonIcon>
          </div>
          {/* <div className="logoContainer">
            <IonImg style={{ width: '60px', height: '60px' }} src="/AlienCafeLogo1.png"></IonImg>
          </div> */}
        </div>
        <div className="flexRow">
          {/* <IonIcon
            onClick={() => {
              history.push("/tab1");
            }}
            size="large"
            icon={closeOutline}
          ></IonIcon> */}
          {/* <IonNavLink
            routerDirection="forward"
            component={() => (
              <Quiz quizTitle={editorHtmlTitle} content={editorHtml} />
            )}
          >
            <IonButton
              shape="round"
              size="small"
              onClick={() => {
                setEditorHtml("");
                setEditorHtmlTitle("");
              }}
            >
              Next
            </IonButton>
          </IonNavLink> */}
        </div>
        <div className="editorContainer">
          <div className="titleEditor">
            <ReactQuill
              className="custom-title-editor"
              ref={titleQuillRef}
              value={editorHtmlTitle}
              placeholder="Enter Title/Thesis/Question"
              onChange={handleTitleChange}
              modules={MyEditor.titleModules}
              formats={MyEditor.titleFormats}
              style={{ height: "fit-content", minHeight: "50px", border: "none" }}
            />
          </div>

          <div className="contentEditor">
            <ReactQuill
              className="custom-content-editor"
              ref={contentQuillRef}
              value={editorHtml}
              placeholder="Enter your supporting narrative, links to sources, and photos"
              onChange={handleChange}
              modules={MyEditor.modules}
              formats={MyEditor.formats}
              style={{ minHeight: "300px", border: "none" }}
            />
          </div>
        </div>
        <div
          id="toolbar"
          style={{
            position: "fixed",
            bottom: "0px",
            width: "70%",
            border: "none",
            background: "white",
            zIndex: 1000,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button className="ql-bold"></button>
          <button className="ql-underline"></button>
          <button className="ql-link"></button>
          <button className="ql-image"></button>
          <button className="ql-list" value="bullet"></button>
        </div>
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
