import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router";
import {
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonButton,
  useIonAlert,
  useIonViewWillLeave,
  useIonViewDidLeave,
  useIonViewDidEnter,
} from "@ionic/react";
import { MyContext } from "../providers/postProvider";


const Quiz = ({ title, content }: { title: string, content: string }) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedSubOption, setSelectedSubOption] = useState<string>("");
  const [present] = useIonAlert();
  const [thesis, setThesis] = useState("");
  const [currentSubCategories, setCurrentSubCategories] = useState();
  const { createPost } = useContext(MyContext);
  const [yesAction, setYesAction] = useState("");
  const [probablyYesAction, setProbablyYesAction] = useState("");
  const [probablyNoAction, setProbablyNoAction] = useState("");
  const [noAction, setNoAction] = useState("");
  const [maybeAction, setMaybeAction] = useState("");
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
    "Guns",
    "Government",
    "Health",
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
    "Sci-Fi",
    "Secret Societies",
    "Self Improvement",
    "Sports",
    "Tech",
    "Travel",
    "War",
    "Weapons",
    "Weather",
    "World Organizations",
  ];

  const subCategories: Record<string, string[]> = {
    Animals: [
      "Insects",
      "Microbiology",
    ],
    Business: [
      "Corporations",
      "Small Businesses",
      "Entrepreneurship",
    ],
    ClimateChange: [
      "Proof of Climate Change",
      "Climate Change Hoax",
    ],
    Espionage: [
      "The Kennedy Assasinations",
      "The Titanic",
    ],
    Finance: [
      "Banks and Credit Unions",
      "Foreign Banks",
    ],
    Food: [
      "Toxins",
    ],
    Government: [
      "Deep State",
      "Executive",
      "Legislature",
      "Judicial System",
      "Bureaucracy",
    ],
    Health: [
      "Vaccines",
      "Self Help",
    ],
    History: [
      "Wars",
      "The Holocaust",
      "Ancient Civilizations",
    ],
    Hobby: [
      "Crafts",
      "Musings",
      "How Things Work",
    ],
    Horror: [
      "Real Crime",
      "Disappearances",
    ],
    Immigration: [
      "US Immigration",
      "European Immigration",
    ],
    International: [
      "CCP",
      "Russia",
      "Israel",
      "Ukraine",
      "Europe",
      "Africa",
      "Australia",
      "Asia",
    ],
    Love: [
      "Love",
      "Marriage",
      "Relationships",
    ],
    TheMedia: [
      "News",
    ],
    People: [
      "Jeffrey Epstein",
      "Bill Gates",
      "The Clintons",
    ],
    Religion: [
      "Christianity",
      "Islam",
      "Non-religious",
      "Hinduism",
      "Buddhism",
    ],
    Science: [
      "Time Travel",
      "Alternate History",
      "Dystopian Societies",
      "Magic Realism",
    ],
    SecretS: [
      "Illuminati",
      "Skull And Bones",
      "The Bilderberg Group",
      "The Club Of Rome",
    ],
    Technology: [
      "Artificial Intelligence",
    ],
    War: [
      "Ukraine",
      "Israel",
    ],
    Weather: [
      "North Carolina",
      "Lahaina",
    ],
    WorldOrganizations: [
      "WHO",
      "Club Of Rome",
      "UN",
    ],
  }

  const handleOptionChange = (e: CustomEvent) => {
    const value = e.detail.value
    setCurrentSubCategories(undefined)
    setSelectedOption(value);
  };

  const handleSubChange = (e: CustomEvent) => {
    const value = e.detail.value
    setSelectedSubOption(value);
  };

  useIonViewWillLeave(() => {
    setThesis("");
    setYesAction("");
    setMaybeAction("");
    setNoAction("");
  }, []);


  // useIonViewWillLeave(() => {
  //   console.log("Cleaning up resources...");
  //   setToggle(false);
  // });


  useIonViewDidEnter(() => {
    console.log("Cleaning up resources...");
    setToggle(true);
  });

  useIonViewDidLeave(() => {
    setToggle(true);
  });


  useEffect(() => {
    getSubCategories(selectedOption)
  }, [selectedOption])

  function getSubCategories(input: string) {    
    if (!options.includes(input)) {
      return `Error: "${input}" is not a valid option.`;
    }

    
    const key = input.replace(/[^a-zA-Z]/g, ''); 
    const subcategories = subCategories[key];


    if (subcategories) {
      setCurrentSubCategories(subcategories)
      return subcategories;
    } else {
      return `No subcategories available for "${input}".`;
    }
  }
  

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
        {currentSubCategories && <IonItem>
          <IonLabel>Choose Category</IonLabel>
          <IonSelect
            multiple={false}
            value={selectedSubOption}
            onIonChange={handleSubChange}
            interfaceOptions={{
              cssClass: "custom-popover",
            }}
          >
            {currentSubCategories?.map((option, index) => (
              <>
                <IonSelectOption key={index} value={option}>
                  {option}
                </IonSelectOption>
              </>
            ))}
          </IonSelect>
        </IonItem>}
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
                setProbablyYesAction(e?.target.value);
              }}
              className="stylish-input"
              value={probablyYesAction}
              placeholder="Probably True"
            ></textarea>
          </IonItem>
          <IonItem lines="none">
            <textarea
              onChange={(e) => {
                setMaybeAction(e?.target.value);
              }}
              className="stylish-input"
              value={maybeAction}
              placeholder="Need more info"
            ></textarea>
          </IonItem>
          <IonItem lines="none">
            <textarea
              onChange={(e) => {
                setProbablyNoAction(e?.target.value);
              }}
              className="stylish-input"
              value={probablyNoAction}
              placeholder="Probably False"
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
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <IonButton disabled={!selectedOption} onClick={() => {
          createPost(
            title,
            content,
            thesis,
            yesAction,
            noAction,
            maybeAction,
            probablyYesAction,
            probablyNoAction,
            selectedOption,
            selectedSubOption,
          );
          history.push("/tab1");
          setMaybeAction('')
          setNoAction('')
          setYesAction('')
        }}>Post</IonButton>
      </div>
    </div>
  );
};

export default Quiz;

