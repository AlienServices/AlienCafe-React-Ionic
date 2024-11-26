import React, { useContext, useEffect, useRef, useState } from "react";
import {
    IonContent,
    IonPage,
    IonTitle,
    useIonViewWillLeave,
    useIonViewDidLeave,
    useIonViewWillEnter,
    IonImg,
    IonMenuButton,
    IonIcon,
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
import { arrowBackCircleOutline } from "ionicons/icons";
import { AlienLogoSVG } from "./SVG";




const HeaderAlien = ({ backArrowToggle }: { backArrowToggle: boolean }) => {
    const history = useHistory();
    const [isLoaded, setIsLoaded] = useState(false);

    const goBack = () => {
        history.goBack();
    };


//   useEffect(() => {
//     const logo = new Image();
//     logo.src = '/alienLogo.svg';
//     logo.onload = () => setIsLoaded(true);
//   }, []);

    return (
        <div className="brown" >
            <div className="leftMiddle">
                <div style={{
                    borderRadius: '10px', backgroundColor: 'white', width: '45px', display: 'flex', justifyContent: 'center',
                    alignItems: 'center', margin: '10px'
                }}>
                    {backArrowToggle ? <IonIcon
                        style={{
                            fontSize: '28px',
                            color: 'black',
                        }}
                        color="primary"
                        onClick={() => {goBack()}}
                        icon={arrowBackCircleOutline}>
                    </IonIcon> : <IonMenuButton style={{ backgroundColor: 'white' }} color={'primary'} />}
                </div>
                <div className="logoContainer" style={{ top: '80px' }}>
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
                        {/* <IonImg
                            style={{ width: '100%', height: '100%' }}
                            src="/alienLogo.svg"
                            rel="preload"
                        /> */}
                        <AlienLogoSVG/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderAlien