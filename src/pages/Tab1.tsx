import { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';

const Tab1: React.FC = () => { 
 

 

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader >          
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <p>Signup Here</p>
        <IonInput placeholder='Email'></IonInput>
        <IonInput placeholder='Username'></IonInput>
        <IonInput placeholder='Password'></IonInput>
        <p>Login Here</p>
        <IonInput placeholder='Username'></IonInput>
        <IonInput placeholder='Password'></IonInput>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
