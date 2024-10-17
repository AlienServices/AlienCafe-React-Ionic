import React, { useState, useEffect, useRef, useContext } from "react";
import {
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { MyContext } from "../../providers/postProvider";
import { useHistory } from "react-router";
import Post from "../postComponents/Post";

const Saved = ({ search }: { search: string }) => {
  const [editorHtmlTitle, setEditorHtmlTitle] = useState("");
  const [editorHtml, setEditorHtml] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // State for selected category
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


  const categories = ["Technology", "Health", "Sports", "Entertainment"];


  const searchUsers = async () => {
    try {
      const result = await fetch(
        `http://localhost:3000/api/searchBookmarks?search=${search}&category=${selectedCategory}`
      );
      const users = await result.json();
      console.log(users, 'these are users')
      setSearchResults(users.bookmarks); // Update state with the search results
    } catch (err) {
      console.log("Error searching users:", err);
    }
  };


  useEffect(() => {
    if (search.length > 0) {
      searchUsers();
    } else {
      setSearchResults([])
    }
  }, [search, selectedCategory]);



  return (
    <>      
        <>
          <IonSelect
            className="custom-ion-select"
            multiple={true}
            value={selectedCategory}
            placeholder="Select Categorys"
            onIonChange={(e) => setSelectedCategory(e.detail.value)}
          >
            {categories.map((category, index) => (
              <IonSelectOption key={index} value={category}>
                {category}
              </IonSelectOption>
            ))}
          </IonSelect>
        </>

        {/* Display Search Results */}
        {searchResults?.length > 0 ? (
          searchResults.map((user, index) => (
            <Post key={index} post={user.post} />
          ))
        ) : (
          <IonItem>
            <IonLabel>No Bookmarks found.</IonLabel>
          </IonItem>
        )}      
    </>
  );
};

export default Saved;
