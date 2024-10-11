import React, { useEffect, useState, useContext } from "react";

import "react-quill/dist/quill.snow.css";
import { supabase } from "../supaBase";
import "../../theme/PostComponents.css";
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
    IonCard,
    IonImg
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
    // const [profileImage, setProfileImage] = useState<any>(null);
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


    const profileImage = (id: string) => {
        if (id) {
            const newProfileImageUri = `${import.meta.env.VITE_APP_SUPABASE_URL
                }/storage/v1/object/public/ProfilePhotos/${id}.jpg`;
            return newProfileImageUri;
        }
    };


    return (
        <IonCard style={{ boxShadow: 'none', margin: '10px' }}>
            <div className="row">
                <img className="profile-photo" src={profileImage(profile.id)} alt="" />
                <div style={{ width: '175px' }} className="usernameSearch">{profile.username}</div>
            </div>
        </IonCard>
    );
};

export default Profile;
