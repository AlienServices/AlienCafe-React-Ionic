import React, { useState } from 'react';
import {
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonList,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonButton,
  useIonAlert,
} from '@ionic/react';

const Quiz: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [present] = useIonAlert();

  const options = ['Aliens', 'Covid 19', 'Vaccines', 'Something', 'Test'];
  
  const handleCheckboxChange = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(prevSelected => prevSelected.filter(item => item !== option));
    } else if (selectedOptions.length < 3) {
      setSelectedOptions(prevSelected => [...prevSelected, option]);
    } else {
      present({
        header: 'Selection Limit',
        message: 'You can only select up to 3 options.',
        buttons: ['OK']
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dropdown Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel>Choose Category</IonLabel>
          <IonSelect
            multiple={true}
            value={selectedOptions}
            interfaceOptions={{
              cssClass: 'custom-popover',
            }}
          >
            {options.map((option) => (
              <IonSelectOption key={option} value={option}>
                <IonItem lines="none">
                  <IonLabel>{option}</IonLabel>
                  <IonCheckbox
                    slot="start"
                    checked={selectedOptions.includes(option)}
                    onIonChange={() => handleCheckboxChange(option)}
                  />
                </IonItem>
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default Quiz;