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
import { closeOutline } from "ionicons/icons";

const Saved = ({ search }: { search: string }) => {
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
    const contentQuillRef = useRef(null);

    // useEffect(() => {
    //   debugger
    // }, [])

    return (
        <IonPage style={{ paddingTop: '20px', padding: "15px" }}>
            <IonContent>
                <div>
                    Saved
                </div>
            </IonContent>
        </IonPage>
    );
};


export default Saved;
