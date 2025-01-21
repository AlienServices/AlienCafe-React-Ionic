import {
  IonMenuButton,
  IonIcon,
  IonModal,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
} from "@ionic/react";
import { useHistory } from "react-router";
import "swiper/css";
import "swiper/css/pagination";
import "../../theme/Tab3.css";
import { arrowBackCircleOutline, filterOutline } from "ionicons/icons";
import { AlienLogoSVG } from "./SVG";
import { useEffect, useState } from "react";

const HeaderAlien = ({
  backArrowToggle,
  next,
  content,
  title,
  category,
  subCategories,
  selectedSubCategories,
  setSelectedCategories,
  setSelectedSubCategories,
  selectedCategories,
  allCategories
}: {
  backArrowToggle: boolean;
  allCategories: {}
  subCategories: {}
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedSubCategories: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSubCategories: {}
  selectedCategories: {}
  category: string
  next: boolean;
  content: string;
  title: string;
}) => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false)
  const goBack = () => {
    history.goBack();
  };
  // const [selectedCategories, setSelectedCategories] = useState<string[]>(allCategories || []);
  // const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(subCategories || []);

  //   useEffect(() => {
  //     const logo = new Image();
  //     logo.src = '/alienLogo.svg';
  //     logo.onload = () => setIsLoaded(true);
  //   }, []);

  // const [categories, setCategories] = useState([
  //   "Aliens",
  //   "Animals",
  //   "Climate Change",
  //   "Crazy Conspiracy Theories",
  //   "Current Events",
  //   "Death Afterlife",
  //   "Drama Romance",
  //   "Espionage",
  //   "Finance",
  //   "Food",
  //   "Guns",
  //   "Government",
  //   "Health",
  //   "History",
  //   "Immigration",
  //   "International",
  //   "Literature",
  //   "LGBTQ",
  //   "Love",
  //   "The Media",
  //   "Movies and TV",
  //   "Mysteries",
  //   "People",
  //   "Religion, Spiritualities & Culture",
  //   "Science",
  //   "Sci-Fi",
  //   "Secret Societies",
  //   "Self Improvement",
  //   "Sports",
  //   "Tech",
  //   "Travel",
  //   "War",
  //   "Weapons",
  //   "Weather",
  //   "World Organizations",
  // ]);



  // const subCategories: Record<string, string[]> = {
  //   Animals: [
  //     "Insects",
  //     "Microbiology",
  //   ],
  //   Business: [
  //     "Corporations",
  //     "Small Businesses",
  //     "Entrepreneurship",
  //   ],
  //   ClimateChange: [
  //     "Proof of Climate Change",
  //     "Climate Change Hoax",
  //   ],
  //   Espionage: [
  //     "The Kennedy Assasinations",
  //     "The Titanic",
  //   ],
  //   Finance: [
  //     "Banks and Credit Unions",
  //     "Foreign Banks",
  //   ],
  //   Food: [
  //     "Toxins",
  //   ],
  //   Government: [
  //     "Deep State",
  //     "Executive",
  //     "Legislature",
  //     "Judicial System",
  //     "Bureaucracy",
  //   ],
  //   Health: [
  //     "Vaccines",
  //     "Self Help",
  //   ],
  //   History: [
  //     "Wars",
  //     "The Holocaust",
  //     "Ancient Civilizations",
  //   ],
  //   Hobby: [
  //     "Crafts",
  //     "Musings",
  //     "How Things Work",
  //   ],
  //   Horror: [
  //     "Real Crime",
  //     "Disappearances",
  //   ],
  //   Immigration: [
  //     "US Immigration",
  //     "European Immigration",
  //   ],
  //   International: [
  //     "CCP",
  //     "Russia",
  //     "Israel",
  //     "Ukraine",
  //     "Europe",
  //     "Africa",
  //     "Australia",
  //     "Asia",
  //   ],
  //   Love: [
  //     "Love",
  //     "Marriage",
  //     "Relationships",
  //   ],
  //   TheMedia: [
  //     "News",
  //   ],
  //   People: [
  //     "Jeffrey Epstein",
  //     "Bill Gates",
  //     "The Clintons",
  //   ],
  //   Religion: [
  //     "Christianity",
  //     "Islam",
  //     "Non-religious",
  //     "Hinduism",
  //     "Buddhism",
  //   ],
  //   Science: [
  //     "Time Travel",
  //     "Alternate History",
  //     "Dystopian Societies",
  //     "Magic Realism",
  //   ],
  //   SecretS: [
  //     "Illuminati",
  //     "Skull And Bones",
  //     "The Bilderberg Group",
  //     "The Club Of Rome",
  //   ],
  //   Technology: [
  //     "Artificial Intelligence",
  //   ],
  //   War: [
  //     "Ukraine",
  //     "Israel",
  //   ],
  //   Weather: [
  //     "North Carolina",
  //     "Lahaina",
  //   ],
  //   WorldOrganizations: [
  //     "WHO",
  //     "Club Of Rome",
  //     "UN",
  //   ],
  // }


  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => {      
      console.log("previous.inclues", prev.includes(cat));
      const updatedCategories = prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat];
      console.log("[...prev, cat]", [...prev, cat]);
      console.log("updated categories]", updatedCategories);
      return updatedCategories;
    });
  };
  


  const toggleSubCategory = (category: string, subCat: string) => {
    setSelectedSubCategories((prev) => {
      // Get the current list of selected subcategories for the category
      const currentSubCategories = prev[category] || [];

      // Check if the subcategory is already selected
      if (currentSubCategories.includes(subCat)) {
        // Remove the subcategory
        return {
          ...prev,
          [category]: currentSubCategories.filter((s) => s !== subCat),
        };
      } else {
        // Add the subcategory
        return {
          ...prev,
          [category]: [...currentSubCategories, subCat],
        };
      }
    });
  };





  return (
    <div className="brown">
      <div className="leftMiddle">
        <div
          style={{
            borderRadius: "10px",
            backgroundColor: "white",
            width: "45px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "10px",
          }}
        >
          {backArrowToggle ? (
            <IonIcon
              style={{
                fontSize: "28px",
                color: "black",
              }}
              color="primary"
              onClick={() => {
                goBack();
              }}
              icon={arrowBackCircleOutline}
            ></IonIcon>
          ) : (
            <IonMenuButton
              style={{ backgroundColor: "white" }}
              color={"primary"}
            />
          )}
        </div>
        <div className="logoContainer" style={{ top: "80px" }}>
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
            <AlienLogoSVG />
          </div>
        </div>
        {next ? (
          <button
            onClick={() => history.push("/quiz", { quizTitle: title, content })}
            className="button"
          >
            next
          </button>
        ) : (
          <></>
        )}
        {/* <IonMenuButton
          style={{ backgroundColor: "white" }}
          color={"primary"}
          menu="right-menu"
        /> */}
      </div>
      <IonModal isOpen={isOpen} >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Filters</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsOpen(false)}>Save</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {category && <>
            <div>
              {
                subCategories[category] && <div style={{ textAlign: 'center', fontSize: '23px', padding: '10px' }}>
                  sub categories
                </div>
              }
              <div className="gridTwoRow" style={{ padding: '20px' }}>
                {subCategories[category?.replace(/\s+/g, "")]?.map((cat) => {
                  return <div className="gridItemRow">
                    <div style={{ paddingBottom: '10px', textAlign: 'center', padding: '5px' }}>{cat}</div>
                    <input type="checkbox" checked={selectedSubCategories[category]?.includes(cat)} onChange={() => toggleSubCategory(category, cat)} />
                  </div>
                })}
              </div>
            </div>
            <div style={{ textAlign: 'center', fontSize: '20px', paddingBottom: '30px' }}>Filter Your Feed</div>
            <div className="grid">
              {allCategories?.map((cat) => {
                return <div className="gridItem">
                  <div style={{ paddingBottom: '10px', textAlign: 'center' }}>{cat}</div>
                  <input type="checkbox" checked={selectedCategories?.includes(cat)} onChange={() => toggleCategory(cat)} />
                </div>
              })}
            </div>
          </>}
        </IonContent>
      </IonModal>
      {category && <div>
        <IonIcon color="white" onClick={() => setIsOpen(true)} size="large" icon={filterOutline}></IonIcon>
      </div>}
      {/* <IonButton expand="block" onClick={() => setIsOpen(true)}>
        Open
      </IonButton> */}
    </div>
  );
};

export default HeaderAlien;
