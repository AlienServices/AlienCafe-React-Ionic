import React, { useState, useRef, useContext, useEffect } from "react";
import ReactQuill from "react-quill";
import { MyContext } from "../../providers/postProvider";
import { useHistory } from "react-router";
import "react-quill/dist/quill.snow.css";
import "../../theme/create.css";
import {
    IonPage,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonButton,
    IonSelect,
    IonSelectOption,
} from "@ionic/react";
import Post from "../postComponents/Post";

const Posts = ({ search }: { search: string }) => {
    const [editorHtmlTitle, setEditorHtmlTitle] = useState("");
    const [editorHtml, setEditorHtml] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>(""); // Category selection state
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

    const categories = ["Technology", "Health", "Sports", "Entertainment", "Covid", "Aliens", "Space", "9/11", "Test", "Israel"]; // Add your categories here

    // Fetch posts based on search query
    const searchUsers = async () => {
        try {
            const result = await fetch(
                `http://localhost:3000/api/searchPosts?search=${search}&category=${selectedCategory}`
            );
            const users = await result.json();
            console.log(users.posts)
            setSearchResults(users.posts);
        } catch (err) {
            console.log("Error searching users:", err);
        }
    };

    // Search and filter posts when search or category changes
    useEffect(() => {
        if (search.length > 0) {
            searchUsers();
        } else {
            setSearchResults([])
        }
    }, [search, selectedCategory]); // Update when search or selectedCategory changes

    console.log(searchResults, 'these are search results');

    return (
        <IonPage style={{ paddingTop: "20px", padding: "15px" }}>
            <IonContent  className="page no-scrollbar" >
                <IonItem>
                    <IonLabel>Select Categorys</IonLabel>
                    <IonSelect
                        multiple={true}
                        value={selectedCategory}
                        placeholder="Choose a category"
                        onIonChange={(e) => setSelectedCategory(e.detail.value)}
                    >
                        {categories.map((category, index) => (
                            <IonSelectOption key={index} value={category}>
                                {category}
                            </IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>

                {searchResults?.length > 0 ? (
                    searchResults.map((user, index) => (
                        <Post key={index} post={user} />
                    ))
                ) : (
                    <IonItem>
                        <IonLabel>No Posts found</IonLabel>
                    </IonItem>
                )}
            </IonContent>
        </IonPage>
    );
};

export default Posts;
