import React, { useState, useContext } from "react";
import { useHistory } from "react-router";
import {
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonList,
  IonNavLink,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonButton,
  useIonAlert,
  IonTextarea,
} from "@ionic/react";
import Tab3 from "../pages/Homepage";
import { MyContext } from "../providers/postProvider";

interface TestProps {
  quizTitle: string;
  content: string;
}

const Quiz = (props: TestProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [present] = useIonAlert();
  const [thesis, setThesis] = useState("");
  const { createPost } = useContext(MyContext);
  const [yesAction, setYesAction] = useState("");
  const [noAction, setNoAction] = useState("");
  const [maybeAction, setMaybeAction] = useState("");
  const history = useHistory();

  const options = [
    "Aliens",
    "Vaccines",
    "Government",
    "Space",
    "9/11",
    "Covid",
    "Israel",
  ];

  const handleOptionChange = (e: CustomEvent) => {
    setSelectedOption(e.detail.value);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="flexRowCenter">
            <IonNavLink routerDirection="back" component={Tab3}>
              <IonButton
                onClick={() => {
                  history.push("/tab1");
                }}
              >
                Back
              </IonButton>
            </IonNavLink>
            <IonNavLink routerDirection="back" component={Tab3}>
              <IonButton
                onClick={() => {
                  console.log(selectedOption, "selected option");
                  createPost(
                    props.quizTitle,
                    props.content,
                    thesis,
                    yesAction,
                    noAction,
                    maybeAction,
                    [selectedOption],
                  );
                  history?.push("/tab1");
                }}
              >
                Create
              </IonButton>
            </IonNavLink>
          </div>
        </IonToolbar>
      </IonHeader>
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
