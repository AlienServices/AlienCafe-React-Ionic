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
import { supabase } from "../../components/supaBase";
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
  const [toggle, setToggle] = useState(true)
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
  const [currentCategory, setCurrentCategory] = useState(categories[0]); 

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

  useIonViewWillLeave(() => {
    console.log("Cleaning up resources...");
    setToggle(false)
  });

  useIonViewDidLeave(() => {
    console.log("Cleaning up resources...");
    setToggle(true)
  });

  return (
    <>
      <Menu />      
      <IonPage id="main-content" style={{opacity: toggle? "1" : "0", transition: "opacity 0.3s ease-in-out" }}>
        <div className="brown" style={{ height: '150px', opacity: toggle? "1": "0", transition: "opacity 0.3s ease-in-out" }}>
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
            <div className="logoContainer" style={{ top: '90px' }}>
            <div
                style={{
                  borderRadius: '50%', 
                  overflow: 'hidden', 
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <IonImg
                  style={{ width: '100%', height: '100%' }} 
                  src="/alienLogo.svg"
                />
              </div>
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
            style={{ height: "115%" }}
          >
            {categories.map((category, index) => (
              <SwiperSlide key={index}>
                <Category setToggle={(value) => setToggle(value)} category={category} />
              </SwiperSlide>
            ))}
          </Swiper>
          
        </IonContent>
      </IonPage>
    </>
  );
};

export default Tab3;
