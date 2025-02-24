import React, { useState, useEffect, useContext } from "react";
import "react-quill/dist/quill.snow.css";
import "../../theme/create.css";
import { IonContent, IonItem, IonLabel, IonPage, IonSpinner } from "@ionic/react";
import Profile from "../postComponents/Profile";
import { MyContext } from "../../providers/postProvider";

const Profiles = ({ search }: { search: string }) => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getBaseUrl } = useContext(MyContext)

  const searchUsers = async () => {
    setLoading(true)
    try {
      const result = await fetch(
        `${getBaseUrl()}/api/posts/searchProfiles?username=${search}`,
      );
      const users = await result.json();
      setLoading(false)
      setSearchResults(users.user);
    } catch (err) {
      console.log(err, "search user error");
    }
  };

  useEffect(() => {
    if (search.length > 0) {      
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [search]);



  return (
    // <div style={{ paddingTop: "20px", padding: "15px" }}>
    <div>
      {loading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '30px' }}><IonSpinner></IonSpinner></div> : <>{searchResults.length > 0 ? (
        searchResults?.map((user, index) =>
        (
          // <IonItem key={user.id}>
          // </IonItem>
          <Profile profile={user} key={user?.id} />
        ))
      ) : (
        <IonItem style={{ width: "100%" }}>
          <IonLabel>No users found.</IonLabel>
        </IonItem>
      )}</>}
    </div>
    // </div>
  );
};

export default Profiles;
