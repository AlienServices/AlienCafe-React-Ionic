import React, {  useState, useContext } from "react";
import "react-quill/dist/quill.snow.css";
import "../../theme/PostComponents.css";
import { MyContext } from "../../providers/postProvider";
import { useHistory } from "react-router";
import {
    IonCard,    
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



    const profileImage = (id: string) => {
        if (id) {
            const newProfileImageUri = `${import.meta.env.VITE_APP_SUPABASE_URL
                }/storage/v1/object/public/ProfilePhotos/${id}.jpg`;
            return newProfileImageUri;
        }
    };


    return (
        <IonCard  style={{ boxShadow: 'none', margin: '10px' }}>
            <div className="row">
                <img className="profile-photo" src={profileImage(profile.id)} alt="" />
                <div className="center">
                    <div className="username">{profile.username}</div>
                    <div className="tag">{profile.username}</div>
                </div>
            </div>
        </IonCard>
    );
};

export default Profile;
