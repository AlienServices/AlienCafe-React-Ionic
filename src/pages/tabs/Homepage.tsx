import React, { useContext, useRef, useState } from "react";
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
  const [currentCategory, setCurrentCategory] = useState(categories[0]);

  useIonViewWillLeave(() => {
    console.log("Cleaning up resources...");
    setToggle(false);
  });


  useIonViewWillEnter(() => {
    console.log("Cleaning up resources...");
    setPageKey((prevKey) => prevKey + 1);
    setToggle(true);
    setCurrentCategory(categories[0]);
  }, []);

  console.log(getBaseUrl(), 'this is the base url')


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
        <HeaderAlien next={false} title={'null'} content={''} backArrowToggle={false} />
        <IonContent>
          {/* <div className="middle">
            <IonTitle>{currentCategory}</IonTitle>
          </div> */}
          <Swiper
            modules={[Pagination]}
            spaceBetween={10}
            slidesPerView={1}
            loop={true}
            onSlideChange={(swiper) =>
              setCurrentCategory(categories[swiper.realIndex])
            }
          >
            {categories.map((category, index) => (
              <SwiperSlide
                key={index}
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
