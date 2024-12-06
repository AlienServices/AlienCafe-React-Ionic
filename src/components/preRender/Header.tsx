import {  
  IonMenuButton,
  IonIcon,
} from "@ionic/react";
import { useHistory } from "react-router";
import "swiper/css";
import "swiper/css/pagination";
import "../../theme/Tab3.css";
import { arrowBackCircleOutline } from "ionicons/icons";
import { AlienLogoSVG } from "./SVG";

const HeaderAlien = ({
  backArrowToggle,
  next,
  content,
  title,
}: {
  backArrowToggle: boolean;
  next: boolean;
  content: string;
  title: string;
}) => {
  const history = useHistory();  

  const goBack = () => {
    history.goBack();
  };

  //   useEffect(() => {
  //     const logo = new Image();
  //     logo.src = '/alienLogo.svg';
  //     logo.onload = () => setIsLoaded(true);
  //   }, []);

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
            {/* <IonImg
                            style={{ width: '100%', height: '100%' }}
                            src="/alienLogo.svg"
                            rel="preload"
                        /> */}
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
      </div>
    </div>
  );
};

export default HeaderAlien;
