import "react-quill/dist/quill.snow.css";
import "../../theme/PostComponents.css";
import { IonCard } from "@ionic/react";

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
  

  const profileImage = (id: string) => {
    if (id) {
      const newProfileImageUri = `${
        import.meta.env.VITE_APP_SUPABASE_URL
      }/storage/v1/object/public/ProfilePhotos/${id}.jpg`;
      return newProfileImageUri;
    }
  };

  return (
    <IonCard style={{ boxShadow: "none", margin: "10px" }}>
      <div style={{width: '60%'}} className="row">
        <img className="profile-photo" src={profileImage(profile.id)} alt="" />
        <div className="center" style={{width: '200px'}}>
          <div className="username">{profile.username}</div>
          <div className="tag">{profile.username}</div>
        </div>
      </div>
    </IonCard>
  );
};

export default Profile;
