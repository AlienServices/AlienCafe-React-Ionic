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
} from "@ionic/react";
import Tab3 from "../../src/pages/tabs/Homepage";
import { MyContext } from "../providers/postProvider";

interface LocationState {
  quizTitle: string;
  content: string;
}

const Quiz = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [present] = useIonAlert();
  const [thesis, setThesis] = useState("");
  const { createPost } = useContext(MyContext);
  const [yesAction, setYesAction] = useState("");
  const [noAction, setNoAction] = useState("");
  const [maybeAction, setMaybeAction] = useState("");
  const location = useLocation<LocationState>();
  const { quizTitle, content } = location.state || {};
  const history = useHistory();

  const options = [
    "Aliens",
    "Climate Change",
    "Crazy Conspiracy Theories",
    "Fiinance",
    "Food",
    "Government & Politics",
    "Health & Medicine",
    "History",
    "Immigration",
    "Love",
    "The Media",
    "People",
    "Secret Societies",
    "Tech & Internet",
    "War",
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

  // console.log(quizTitle, 'this is the quiz title')

  return (
    <IonPage>
      <div style={{  paddingTop: "5px" }} className="brown">
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
      </div>
      <IonContent className="ion-padding">
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
                setThesis(e?.target.value);
              }}
              className="stylish-input"
              placeholder="Thesis Question"
            ></textarea>
          </IonItem>
          <IonItem lines="none">
            <textarea
              onChange={(e) => {
                setYesAction(e?.target.value);
              }}
              className="stylish-input"
              placeholder="Action if user votes yes"
            ></textarea>
          </IonItem>
          <IonItem lines="none">
            <textarea
              onChange={(e) => {
                setMaybeAction(e?.target.value);
              }}
              className="stylish-input"
              placeholder="Action if user votes maybe"
            ></textarea>
          </IonItem>
          <IonItem lines="none">
            <textarea
              onChange={(e) => {
                setNoAction(e?.target.value);
              }}
              className="stylish-input"
              placeholder="Action if user votes no"
            ></textarea>
          </IonItem>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Quiz;
