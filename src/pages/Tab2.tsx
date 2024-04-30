import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonList, IonItem, IonLabel, IonCardSubtitle, IonIcon } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';
import MyPosts from '../components/MyPosts'
import Category from '../components/Category';
import { logoIonic } from 'ionicons/icons';
import { useState } from 'react';

const Tab2: React.FC = () => {

  const [choices, setChoices] = useState({
    posts: 1,
    replies: 0,
    likes: 0,
    categories: 0
  })
  const [posts, setPosts] = useState(0)
  const [replies, setReplies] = useState(0)
  const [likes, setLikes] = useState(1)
  const [categories, setCategories] = useState(0)
  return (
    <IonPage>
      <IonCard className='noMargin' color={'light'}>
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
          <div onClick={() => {
            setChoices({
              posts: 1,
              replies: 0,
              likes: 0,
              categories: 0
            })
          }}>Posts</div>
          <div onClick={() => {
            setChoices({
              posts: 0,
              replies: 1,
              likes: 0,
              categories: 0
            })
          }}>Replies</div>
          <div onClick={() => {
            setChoices({
              posts: 0,
              replies: 0,
              likes: 1,
              categories: 0
            })
          }}>Likes</div>
          <div onClick={() => {
            setChoices({
              posts: 0,
              replies: 0,
              likes: 0,
              categories: 1
            })
          }}>Categories</div>
        </div >
      </IonCard >
      {
        choices.replies ? <>replies</> : choices.posts ? <>< MyPosts /></> : choices.likes ? <>Likes</> : choices.categories ? <><Category/></> : <MyPosts></MyPosts>
      }


    </IonPage >
  );
};

export default Tab2;
