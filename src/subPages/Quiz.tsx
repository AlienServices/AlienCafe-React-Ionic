import React, { useState, useContext } from "react";
import { useHistory, useLocation } from "react-router";
import {
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonNavLink,
  IonHeader,
  IonToolbar,
  IonContent,
  IonPage,
  IonButton,
  useIonAlert,
  IonImg,
  useIonViewWillLeave,
  useIonViewDidLeave,
} from "@ionic/react";
import Tab3 from "../../src/pages/tabs/Homepage";
import { MyContext } from "../providers/postProvider";

interface LocationState {
  quizTitle: string;
  content: string;
}

const Quiz = ({ title, content }: { title: string, content: string }) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [present] = useIonAlert();
  const [thesis, setThesis] = useState("");
  const { createPost } = useContext(MyContext);
  const [yesAction, setYesAction] = useState("");
  const [noAction, setNoAction] = useState("");
  const [maybeAction, setMaybeAction] = useState("");
  // const location = useLocation<LocationState>();
  // const { quizTitle, content } = location.state || {};
  const history = useHistory();
  const [toggle, setToggle] = useState(true);

  const options = [
    "Aliens",
    "Animals",
    "Climate Change",
    "Crazy Conspiracy Theories",
    "Current Events",
    "Death Afterlife",
    "Drama Romance",
    "Espionage",
    "Finance",
    "Food",
    "Guns & Ammo",
    "Government & Politics",
    "Health & Medicine",
    "History",
    "Immigration",
    "International",
    "Literature",
    "LGBTQ",
    "Love",
    "The Media",
    "Movies and TV",
    "Mysteries",
    "People",
    "Religion, Spiritualities & Culture",
    "Science",
    "Sci-Fi & Fantasy",
    "Secret Societies",
    "Self Improvement",
    "Sports & Athletics",
    "Tech & Internet",
    "Travel",
    "War",
    "Weapons",
    "Weather",
    "World Organizations",
  ];

  const handleOptionChange = (e: CustomEvent) => {
    setSelectedOption(e.detail.value);
  };

  useIonViewWillLeave(() => {
    setThesis("");
    setYesAction("");
    setMaybeAction("");
    setNoAction("");
  }, []);


  useIonViewWillLeave(() => {
    console.log("Cleaning up resources...");
    setToggle(false);
  });

  useIonViewDidLeave(() => {
    setToggle(true);
  });

  // console.log(quizTitle, 'this is the quiz title')

  return (
    <div style={{
      opacity: toggle ? "1" : "0",
      transition: "opacity 0.2s ease-in-out",
      paddingBottom: '100px'
    }}>
      {/* <div style={{  paddingTop: "5px" }} className="brown">
        <div className="flexRowCenter">
          <IonNavLink routerDirection="back" component={Tab3}>
            <button
              className="nextButton"
              onClick={() => {
                history.goBack();
              }}
            >
              Back
            </button>
          </IonNavLink>
        </div>
        <div style={{ top: "80px" }} className="logoContainer">
          <div
            style={{
              borderRadius: "50%",
              overflow: "hidden",
              width: "60px",
              height: "60px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IonImg
              style={{ width: "100%", height: "100%" }}
              src="/alienLogo.svg"
            />
          </div>
        </div>
        <IonNavLink routerDirection="forward" component={Tab3}>
          <button
            className="nextButton"
            onClick={() => {
              console.log(selectedOption, "selected option");
              createPost(
                quizTitle,
                content,
                thesis,
                yesAction,
                noAction,
                maybeAction,
                selectedOption,
              );
              history?.push("/tab1");
            }}
          >
            Create
          </button>
        </IonNavLink>
      </div> */}
      <div className="ion-padding">
        <IonItem>
          <IonLabel>Choose Category</IonLabel>
          <IonSelect
            multiple={false}
            value={selectedOption}
            onIonChange={handleOptionChange}
            interfaceOptions={{
              cssClass: "custom-popover",
            }}
          >
            {options.map((option, index) => (
              <IonSelectOption key={index} value={option}>
                {option}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <div className="spaceColumn">
          <IonItem lines="none">
            <textarea
              onChange={(e) => {
                setYesAction(e?.target.value);
              }}
              className="stylish-input"
              value={yesAction}
              placeholder="Action if user votes yes"
            ></textarea>
          </IonItem>
          <IonItem lines="none">
            <textarea
              onChange={(e) => {
                setMaybeAction(e?.target.value);
              }}
              className="stylish-input"
              value={maybeAction}
              placeholder="Action if user votes maybe"
            ></textarea>
          </IonItem>
          <IonItem lines="none">
            <textarea
              value={noAction}
              onChange={(e) => {
                setNoAction(e?.target.value);
              }}
              className="stylish-input"
              placeholder="Action if user votes no"
            ></textarea>
          </IonItem>
        </div>
      </div>
      <IonButton onClick={() => {
        createPost(
          title,
          content,
          thesis,
          yesAction,
          noAction,
          maybeAction,
          selectedOption,
        );
        history?.push("/tab1");
        setMaybeAction('')
        setNoAction('')
        setYesAction('')
      }}>Post</IonButton>
    </div>
  );
};

export default Quiz;
