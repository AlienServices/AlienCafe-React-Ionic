import React, { useState } from 'react';
import "../theme/chat.css";
import { useContext } from 'react';
import { useHistory } from "react-router";
import {
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonInput,
  IonList,
  IonNavLink,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonButton,
  useIonAlert,
  IonTextarea,
} from '@ionic/react';
import Tab2 from '../pages/Login';
import Tab3 from '../pages/Tab3';
import { MyContext } from '../providers/postProvider';

interface TestProps {
  quizTitle: string;
  content: string;
}

const Quiz = (props: TestProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [present] = useIonAlert();
  const [thesis, setThesis] = useState('');
  const { posts, myPosts, setPosts, setMyPosts, updatePost, getAllPosts, myInfo, createPost } =
    useContext(MyContext);
  const [yesAction, setYesAction] = useState('');
  const [noAction, setNoAction] = useState('');
  const [maybeAction, setMaybeAction] = useState('');
  const history = useHistory();

  const options = ['Aliens', 'Covid 19', 'Vaccines', 'Something', 'Test', 'Aliens', 'Covid 19', 'Vaccines', 'Something', 'Test'];

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
          <div className='flexRowCenter'>
            <IonNavLink routerDirection='back' component={Tab3}>
              <IonButton onClick={() => {
                history.push("/tab1")
              }}>Back</IonButton>
            </IonNavLink>
            <IonNavLink routerDirection='back' component={Tab3}>
              <IonButton onClick={() => {
                createPost(props.quizTitle, props.content, thesis, yesAction, noAction, maybeAction, selectedOptions); history?.push("/tab1");
              }}>Next</IonButton>
            </IonNavLink>
          </div>
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
            {options.map((option, index) => (
              <IonSelectOption key={index} value={option}>
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
        <div className='spaceColumn'>
          <IonItem lines='none'>
            <textarea onChange={(e) => {
              console.log(thesis, 'this is thesis')
              setThesis(e?.target.value)
            }} className='stylish-input' placeholder='Thesis Question'></textarea>
          </IonItem>
          <IonItem lines='none'>
            <textarea onChange={(e) => {
              setYesAction(e?.target.value)
            }} className='stylish-input' placeholder='Action if user votes yes'></textarea>
          </IonItem>
          <IonItem lines='none'>
            <textarea onChange={(e) => {
              setMaybeAction(e?.target.value)
            }} className='stylish-input' placeholder='Action if user votes maybe'></textarea>
          </IonItem>
          <IonItem lines='none'>
            <textarea onChange={(e) => {
              setNoAction(e?.target.value)
            }} className='stylish-input' placeholder='Action if user votes no'></textarea>
          </IonItem>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Quiz;