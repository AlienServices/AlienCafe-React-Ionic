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
  IonIcon
} from "@ionic/react";
import {
  arrowBackCircleOutline,
} from "ionicons/icons";
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
        <div className="brown" style={{ height: '110px' }}>
          <div className="leftMiddle">
            <div style={{
              borderRadius: '10px', backgroundColor: 'white', width: '45px', display: 'flex', justifyContent: 'center',
              alignItems: 'center', margin: '10px'
            }}>
              {/* <IonIcon
                style={{
                  fontSize: '28px',
                  color: 'black',
                }}
                color="primary"
                icon={arrowBackCircleOutline}>
              </IonIcon> */}
              <IonMenuButton style={{ backgroundColor: 'white' }} color={'primary'} />
            </div>
            <div className="logoContainer" style={{ top: '60px' }}>
              <IonImg style={{ width: '60px', height: '60px' }} src="/AlienCafeLogo1.png"></IonImg>
            </div>
          </div>
        </div>
        <IonContent >
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
