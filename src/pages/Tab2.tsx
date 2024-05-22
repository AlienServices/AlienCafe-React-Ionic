import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonList, IonItem, IonLabel, IonCardSubtitle, IonIcon } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';
import MyPosts from '../components/MyPosts'
import Category from '../components/Category';
import { logoIonic } from 'ionicons/icons';
import { useEffect, useState } from 'react';

const Tab2 = () => {

  const [choices, setChoices] = useState({
    posts: 1,
    replies: 0,
    likes: 0,
    categories: 0
  })
  const [posts, setPosts] = useState(0)
  const [myInfo, setMyInfo] = useState<{ email: string, id: string, username: string }>()
  const [replies, setReplies] = useState(0)
  const [likes, setLikes] = useState(1)
  const [categories, setCategories] = useState(0)

  useEffect(() => {
    getMyInfo()
  }, [])


  const getMyInfo = async () => {
    try {
      const result = await fetch(`http://localhost:3000/api/myInfo?email=${localStorage.getItem('user')}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
      })
      const posts = await result.json()
      setMyInfo(posts.Hello)
    } catch (error) {
      console.log(error, "this is the create user error")
    }
  }

  console.log(myInfo, 'this is my info')

  return (
    <IonPage>
      <IonCard className='noMargin' color={'light'}>
        <IonIcon icon={logoIonic} size='large'></IonIcon>
        <IonCardHeader>
          <IonCardTitle>
            {myInfo?.username}
          </IonCardTitle>
          <IonCardSubtitle>
            Subtitle?
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          Aspiring fact chaser who enjoys reading science and stuff
        </IonCardContent>
        <div className='flexChoice'>
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
        choices.replies ? <>replies</> : choices.posts ? <>< MyPosts /></> : choices.likes ? <>Likes</> : choices.categories ? <><Category /></> : <MyPosts></MyPosts>
      }


    </IonPage >
  );
};

export default Tab2;
