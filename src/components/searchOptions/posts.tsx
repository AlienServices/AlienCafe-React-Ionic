import React, { useState, useEffect, useContext } from "react";
import { IonLabel, IonSelect, IonSelectOption, IonList } from "@ionic/react";
import Post from "../postComponents/Post";
import { MyContext } from "../../providers/postProvider";

const Posts = ({ search }: { search: string }) => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [toggle, setToggle] = useState<any>(true);
  const { getBaseUrl } = useContext(MyContext);
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // Category selection state
  const categories = [
    "Technology",
    "Health",
    "Sports",
    "Entertainment",
    "Covid",
    "Aliens",
    "Space",
    "9/11",
    "Test",
    "Israel",
  ];

  const searchUsers = async () => {
    try {
      const result = await fetch(
        `${getBaseUrl()}/api/posts/searchPosts?search=${search}&category=${selectedCategory}`,
      );
      const users = await result.json();
      console.log(users.posts);
      setSearchResults(users.posts);
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
    <div style={{ paddingBottom: "200px" }}>
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
            <Post setToggle={setToggle} key={index} post={user} />
          ))
        ) : (
          <div>
            <IonLabel>No Posts found</IonLabel>
          </div>
        )}
      </IonList>
    </div>
  );
};

export default Posts;
