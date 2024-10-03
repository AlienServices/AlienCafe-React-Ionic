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
} from "@ionic/react";
import Post from "../postComponents/Post";

const Posts = ({ search }: { search: string }) => {
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
                `http://localhost:3000/api/searchPosts?search=${search}`
            );
            const users = await result.json();
            setSearchResults(users.user); // Update state with the search results
        } catch (err) {
            console.log("Error searching users:", err);
        }
    };

    
    useEffect(() => {
        if (search.length > 0) {
            searchUsers(); 
        }
    }, [search]);

    console.log(searchResults, 'these are search results')

    return (
        <IonPage style={{ paddingTop: "20px", padding: "15px" }}>
            <IonContent>
                <div>Posts</div>
                {searchResults.length > 0 ? (
                    searchResults.map((user, index) => (
                        <Post post={user} /> 
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

export default Posts;
