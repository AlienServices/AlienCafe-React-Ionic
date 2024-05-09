import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab3.css';
import AllPosts from '../components/AllPosts';

const Tab3: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>All Posts</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <AllPosts />
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
