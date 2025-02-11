import React, { useContext, useEffect, useState } from "react";
import {
  IonContent,
  IonPage,
  useIonViewWillLeave,
  useIonViewWillEnter,
} from "@ionic/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Category from "../../components/categories/Category";
import "swiper/css";
import "swiper/css/pagination";
import "../../theme/Tab3.css";
import { Menu } from "../../components/Menu";
import HeaderAlien from "../../components/preRender/Header";
import { MyContext } from "../../providers/postProvider";

const Tab3: React.FC = () => {
  const [toggle, setToggle] = useState(true);
  const { getBaseUrl } = useContext(MyContext);
  const [pageKey, setPageKey] = useState(0);
  const [categories, setCategories] = useState([
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
  ]);
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

  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories || []);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState(categories[0]);

  useIonViewWillLeave(() => {
    console.log("Cleaning up resources...");
    setToggle(false);
  });


  useIonViewWillEnter(() => {
    setToggle(true);
    setCurrentCategory(selectedCategories[0]);
  }, []);



  return (
    <>
      <Menu />
      <IonPage
        id="main-content"
        style={{
          opacity: toggle ? "1" : "0",
          transition: "opacity 0.2s ease-in-out",
        }}
      >
        <HeaderAlien votes={0} setSelectedCategories={setSelectedCategories} setSelectedSubCategories={setSelectedSubCategories} selectedCategories={selectedCategories} selectedSubCategories={selectedSubCategories} category={currentCategory} allCategories={categories} subCategories={subCategories} next={false} title={'null'} content={''} backArrowToggle={false} />
        <IonContent>
          <Swiper
            autoHeight
            modules={[Pagination]}
            spaceBetween={10}
            slidesPerView={1}
            loop={true}
            onSlideChange={(swiper) =>
              setCurrentCategory(selectedCategories[swiper.realIndex])
            }
          >
            {selectedCategories.map((category, index) => (
              <SwiperSlide
                key={category}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "fit-content",
                  justifyContent: "flex-start",
                  marginBottom: "50px",
                }}
              >
                <Category
                  key={category}
                  setToggle={(value) => setToggle(value)}
                  category={category}
                  selectedSubCategories={selectedSubCategories}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Tab3;
