import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonList, IonItem, IonLabel, IonCardSubtitle, IonIcon } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';
import MyPosts from '../components/MyPosts'
import { logoIonic } from 'ionicons/icons';

const Tab2: React.FC = () => {
  return (
    <IonPage>
      <IonCard color={'light'}>
      <IonIcon icon={logoIonic} size='large'></IonIcon>
        <IonCardHeader>
          <IonCardTitle>
          UserName Tag
          </IonCardTitle>
          <IonCardSubtitle>
          Titles Titles Titles Titles Titles Titles
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          Here is the Bio Here is the Bio Here is the Bio Here is the Bio Here is the Bio Here is the Bio Here is the Bio Here is the Bio Here is the Bio Here is the Bio Here is the Bio Here is the Bio Here is the Bio Here is the Bio Here is the Bio
        </IonCardContent>
        <div className='flex'>
          <div>Posts</div>
          <div>Replies</div>
          <div>Likes</div>
          <div>Categories</div>
        </div>
      </IonCard>
      <MyPosts/>

    </IonPage>
  );
};

export default Tab2;
