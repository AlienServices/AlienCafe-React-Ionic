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
import Profile from "../postComponents/Profile";

const Profiles = ({ search }: { search: string }) => {
  const [editorHtmlTitle, setEditorHtmlTitle] = useState("");
  const [editorHtml, setEditorHtml] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]); // Initialize searchResults as an array
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


  const searchUsers = async () => {
    try {
      const result = await fetch(
        `http://localhost:3000/api/searchProfiles?username=${search}`,
      );
      const users = await result.json();
      console.log(users);
        setSearchResults(users.user);
    } catch (err) {
      console.log("oops");
    }
  };

  useEffect(() => {
    if (search.length > 0) {
        searchUsers(); 
    } else {
      setSearchResults([])
    }
}, [search]);


console.log(searchResults, 'search results')

  return (
    <IonPage style={{ paddingTop: '20px', padding: "15px" }}>
      <IonContent>        
        {searchResults.length > 0 ? (
          searchResults.map((user, index) => (
            <Profile profile={user} />
          ))
        ) : (
          <IonItem>
            <IonLabel>No users found.</IonLabel>
          </IonItem>
        )}
      </IonContent>
    </IonPage>
  );
};


export default Profiles;
