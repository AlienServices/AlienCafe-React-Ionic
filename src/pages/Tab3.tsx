import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab3.css';
import MyPosts from '../components/MyPosts';

const Tab3: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Your Posts</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <MyPosts />
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
