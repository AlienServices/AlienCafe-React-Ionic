import React, { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import "../../theme/create.css";
import {
  IonContent,
  IonItem,
  IonLabel,
  IonPage,  
} from "@ionic/react";
import Profile from "../postComponents/Profile";


const Profiles = ({ search }: { search: string }) => {
  const [searchResults, setSearchResults] = useState<any[]>([]); 


  const searchUsers = async () => {
    try {
      const result = await fetch(
        `http://10.1.10.233:3000/api/searchProfiles?username=${search}`,
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
  

  return (
    <IonPage style={{ paddingTop: '20px', padding: "15px" }}>
      <IonContent>
        <IonItem>
          {searchResults.length > 0 ? (
            searchResults.map((user, index) => (
              <Profile profile={user} key={user?.id} />
            ))
          ) : (
            <IonItem style={{ width: '100%' }}>
              <IonLabel>No users found.</IonLabel>
            </IonItem>
          )}
        </IonItem>
      </IonContent>
    </IonPage>
  );
};


export default Profiles;
