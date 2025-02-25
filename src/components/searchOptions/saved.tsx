import React, { useState, useEffect, useContext } from "react";
import {
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import Post from "../postComponents/Post";
import { MyContext } from "../../providers/postProvider";

const Saved = ({ search }: { search: string }) => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { getBaseUrl } = useContext(MyContext);
  const [toggle, setToggle] = useState<boolean>(true);
  const categories = ["Technology", "Health", "Sports", "Entertainment"];

  const searchUsers = async () => {
    try {
      const result = await fetch(
        `${getBaseUrl()}/api/posts/searchBookmarks?search=${search}&category=${selectedCategory}`,
      );
      const users = await result.json();
      setSearchResults(users.bookmarks);
    } catch (err) {
      console.log("Error searching users:", err);
    }
  };

  useEffect(() => {
    if (search.length > 0) {
      searchUsers();
    } else {
      setSearchResults([]);
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

      <IonList>
        {searchResults?.length > 0 ? (
          searchResults.map((user, index) => (
            <Post setToggle={setToggle} key={index} post={user.post} />
          ))
        ) : (
          <IonItem>
            <IonLabel>No Bookmarks found.</IonLabel>
          </IonItem>
        )}
      </IonList>
    </>
  );
};

export default Saved;
