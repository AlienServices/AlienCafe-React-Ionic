import { IonPage, IonButton, IonCheckbox, IonContent } from "@ionic/react";
import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import "../theme/Tab2.css";

const Category = () => {
  // const [value, setValue] = useState('');

  return (
    <IonContent>
      <div className="optionsCenter">
        <div className="row">
          <IonCheckbox />
          <div>Aliens</div>
        </div>
        <div className="row">
          <IonCheckbox />
          <div>Science</div>
        </div>
        <div className="row">
          <IonCheckbox />
          <div>Covid 19</div>
        </div>
        <div className="row">
          <IonCheckbox />
          <div>Government</div>
        </div>
        <div className="row">
          <IonCheckbox />
          <div>Flat Earth</div>
        </div>
        <div className="row">
          <IonCheckbox />
          <div>Medicine</div>
        </div>
        <div className="row">
          <IonCheckbox />
          <div>Obama</div>
        </div>
      </div>
    </IonContent>
  );
};

export default Category;
