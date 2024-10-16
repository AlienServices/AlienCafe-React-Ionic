import React, { useContext, useRef, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonMenu,
  IonButton,
  IonButtons,
  IonImg,
  IonMenuButton,
  IonToolbar,
  
} from "@ionic/react";
import { useHistory } from "react-router";
import { supabase } from "../../components/supaBase";
import alien from "../../../public/alien.png";
import AllPosts from "../../components/AllPosts";
import { MyContext } from "../../providers/postProvider";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Category from "../../components/categories/Category";
import "swiper/css";
import "swiper/css/pagination";
import "../../theme/Tab3.css";
import { Menu } from "../../components/Menu";

const Tab3: React.FC = () => {
  const { myInfo, setMyInfo } = useContext(MyContext);
  const history = useHistory();
  const menuRef = useRef<HTMLIonMenuElement>(null);
  const [categories, setCategories] = useState([
    "Aliens",
    "Vaccines",
    "Government",
    "Space",
    "9/11",
    "Covid",
    "Israel",
  ]);
  const [currentCategory, setCurrentCategory] = useState(categories[0]); // Track the current category

  const handleLogout = async () => {
    console.log('hitting logout in tab 3')
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log("Logout error:", error);
      } else {
        menuRef.current?.close();
        localStorage.removeItem("user");
        setMyInfo({ id: '', content: '', likes: [], email: '', bio: '', username: '', following: [], followers: [], blurhash: '' })
        history.push("/tab1");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Menu />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <div className="centerAlien">
              <div className="imageContainer">
                <IonImg src={alien} />
              </div>
            </div>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="middle">
            <IonTitle>{currentCategory}</IonTitle>
          </div>
          <Swiper
            modules={[Pagination]}
            spaceBetween={50}
            slidesPerView={1}
            pagination={{ clickable: true }}
            onSlideChange={(swiper) =>
              setCurrentCategory(categories[swiper.activeIndex])
            }
            style={{ height: "100%" }}
          >
            {categories.map((category, index) => (
              <SwiperSlide key={index}>
                <Category category={category} />
              </SwiperSlide>
            ))}
          </Swiper>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Tab3;
