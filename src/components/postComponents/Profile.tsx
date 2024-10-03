import React, { useEffect, useState, useContext } from "react";

import "react-quill/dist/quill.snow.css";
import { supabase } from "../supaBase";
import "../../pages/Tab3.css";
import { MyContext } from "../../providers/postProvider";
import { useHistory } from "react-router";
import moment from "moment";
import {
    IonPage,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonButton,
} from "@ionic/react";

// Define the props type for the Post component
interface Profile {
    profile: {
        id: string;
        email: string;
        username: string;
        bio: string;
        followers: string[];
        following: string[];
    };
}

const Profile: React.FC<Profile> = ({ profile }) => {
    const history = useHistory();
    const [searchResults, setSearchResults] = useState<any[]>([]); // Initialize searchResults as an array
    const {
        myInfo,
        addLike,
        addDislike,
        updateUser,
        getUserPosts,
    } = useContext(MyContext);

    const [user, setUser] = useState({
        bio: "",
        email: "",
        followers: [],
        following: [],
        id: "",
        username: "",
    });
    const [showModal, setShowModal] = useState(false);


 


    return (
        <IonPage style={{ paddingTop: "20px", padding: "15px" }}>
            <IonContent>
                <div>{profile.username}</div>
            </IonContent>
        </IonPage>
    );
};

export default Profile;
