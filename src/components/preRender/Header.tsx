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
import { useState } from "react";

const HeaderAlien = ({
  backArrowToggle,
  votes,
  next,
  content,
  title,
  category,
  subCategories,
  selectedSubCategories,
  setSelectedCategories,
  setSelectedSubCategories,
  selectedCategories,
  allCategories,
}: {
  backArrowToggle: boolean;
  votes: number;
  allCategories: {};
  subCategories: {};
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedSubCategories: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSubCategories: string[];
  selectedCategories: {};
  category: string;
  next: boolean;
  content: string;
  title: string;
}) => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const goBack = () => {
    history.goBack();
  };

  const [color, setColor] = useState<string>();

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => {
      const updatedCategories = prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat].sort();
      return updatedCategories;
    });
  };

  const toggleSubCategory = (category: string, subCat: string) => {
    setSelectedSubCategories((prev) => {
      const currentSubCategories = prev[category] || [];
      if (currentSubCategories.includes(subCat)) {
        return {
          ...prev,
          [category]: currentSubCategories.filter((s) => s !== subCat),
        };
      } else {
        return {
          ...prev,
          [category]: [...currentSubCategories, subCat],
        };
      }
    });
  };

  const alienColor = (votes: number) => {
    if (votes > 100) {
      return "#00b300";
      setColor("#00b300");
    } else if (votes > 50) {
      return "#33ff33";
      setColor("#99ff99");
    } else if (votes > 0) {
      return "#b3ffb3";
      setColor("#ccffcc");
    } else if (votes < 0) {
      return "#ffcccc";
      setColor(" #ffcccc");
    } else if (votes < -50) {
      return "#ff6666";
      setColor("#ff6666");
    } else if (votes < -100) {
      return "#b30000";
      setColor("#ff0000");
    } else {
      return "white";
      setColor("white");
    }
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
            <AlienLogoSVG color={alienColor(votes)} />
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
      <IonModal isOpen={isOpen}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Filters</IonTitle>
            <IonButtons slot="end">
              <IonButton
                onClick={() => {
                  setIsOpen(false);
                  setSelectedCategories((prevCategories) => [
                    ...prevCategories,
                  ]);
                  setSelectedSubCategories((prevSubCategories) => ({
                    ...prevSubCategories,
                  }));
                }}
              >
                Save
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {category && (
            <>
              <div>
                {subCategories[category] && (
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: "23px",
                      padding: "10px",
                    }}
                  >
                    sub categories
                  </div>
                )}
                <div className="gridTwoRow" style={{ padding: "20px" }}>
                  {subCategories[category?.replace(/\s+/g, "")]?.map((cat) => {
                    return (
                      <div className="gridItemRow">
                        <div
                          style={{
                            paddingBottom: "10px",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {cat}
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedSubCategories[category]?.includes(
                            cat,
                          )}
                          onChange={() => toggleSubCategory(category, cat)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "20px",
                  paddingBottom: "30px",
                }}
              >
                Filter Your Feed
              </div>
              <div className="grid">
                {allCategories?.map((cat) => {
                  return (
                    <div className="gridItem">
                      <div
                        style={{ paddingBottom: "10px", textAlign: "center" }}
                      >
                        {cat}
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedCategories?.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </IonContent>
      </IonModal>
      {category && (
        <div>
          <IonIcon
            color="white"
            onClick={() => setIsOpen(true)}
            size="large"
            icon={filterOutline}
          ></IonIcon>
        </div>
      )}
      {/* <IonButton expand="block" onClick={() => setIsOpen(true)}>
        Open
      </IonButton> */}
    </div>
  );
};

export default HeaderAlien;
