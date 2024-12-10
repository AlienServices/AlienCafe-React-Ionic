import React, { useContext, useRef, useState } from "react";
import {
  IonContent,
  IonPage,
  IonTitle,
  useIonViewWillLeave,
  useIonViewDidLeave,
  useIonViewWillEnter,
  IonImg,
  IonMenuButton,
} from "@ionic/react";
import { useHistory } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Category from "../../components/categories/Category";
import "swiper/css";
import "swiper/css/pagination";
import "../../theme/Tab3.css";
import { Menu } from "../../components/Menu";
import { UserContext } from "../../providers/userProvider";
import HeaderAlien from "../../components/preRender/Header";

const Tab3: React.FC = () => {
  const [toggle, setToggle] = useState(true);
  const menuRef = useRef<HTMLIonMenuElement>(null);
  const [categories, setCategories] = useState([
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
  ]);
  const [currentCategory, setCurrentCategory] = useState(categories[0]);

  useIonViewWillLeave(() => {
    console.log("Cleaning up resources...");
    setToggle(false);
  });

  useIonViewDidLeave(() => {
    console.log("Cleaning up resources...");
    setToggle(true);
  });

  return (
    <>
      <Menu />
      <IonPage
        id="main-content"
        style={{
          opacity: toggle ? "1" : "0",
          transition: "opacity 0.4s ease-in-out",
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
            onSlideChange={(swiper) =>
              setCurrentCategory(categories[swiper.activeIndex])
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
