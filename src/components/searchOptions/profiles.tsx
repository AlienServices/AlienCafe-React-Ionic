import React, { useState, useEffect, useContext } from "react";
import "react-quill/dist/quill.snow.css";
import "../../theme/create.css";
import { IonContent, IonItem, IonLabel, IonPage } from "@ionic/react";
import Profile from "../postComponents/Profile";
import { MyContext } from "../../providers/postProvider";

const Profiles = ({ search }: { search: string }) => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { getBaseUrl } = useContext(MyContext)

  const searchUsers = async () => {
    console.log('hitting search users')
    try {
      const result = await fetch(
        `${getBaseUrl()}/api/posts/searchProfiles?username=${search}`,
      );
      const users = await result.json();
      console.log(users.user, 'this is what serach result is');
      setSearchResults(users.user);
    } catch (err) {
      console.log("oops");
    }
  };

  useEffect(() => {
    if (search.length > 0) {
      console.log('in the use effect')
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [search]);

  console.log(searchResults, 'these are search results')

  return (
    <div style={{ paddingTop: "20px", padding: "15px" }}>
      <div>
        {searchResults.length > 0 ? (
          searchResults?.map((user, index) =>             
            (
            <IonItem key={user.id}>
              <Profile profile={user} key={user?.id} />
            </IonItem>
          ))
        ) : (
          <IonItem style={{ width: "100%" }}>
            <IonLabel>No users found.</IonLabel>
          </IonItem>
        )}
      </div>
    </div>
  );
};

export default Profiles;
