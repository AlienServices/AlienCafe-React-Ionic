import { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { useApi } from '../hooks/useApi';
// import Editor from '../components/Editor';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill/core';
import {
  IonButton,
  IonText,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
  useIonLoading,
} from '@ionic/react';
import { supabase } from '../components/supaBase';
import './Tab1.css';
import SignIn from '../components/SignIn';
import CreateAccount from '../components/CreateAccount'
import { MyContext } from '../providers/postProvider';

const Login: React.FC = () => {
  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();
  const { posts, myPosts, setPosts, setMyPosts, updatePost, getAllPosts } = useContext(MyContext)
  const [localEmail, setLocalEmail] = useState(localStorage.getItem('user'))
  const [loggedIn, setLoggedIn] = useState('logged out')
  const [email, setEmail] = useState('logged out')
  const [userName, setUserName] = useState('logged out')
  const [loginToggle, setLoginToggle] = useState<boolean>(true)
  const { createUser } = useApi()


  // useEffect(() => {
  //   if (user?.session.accessToken) {
  //     console.log('logged in')
  //   } else {
  //     getUser()
  //   }
  // }, [user])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{loginToggle ? <>Login</> : <>Sign Up</>}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {loginToggle ? <><SignIn setToggle={setLoginToggle} /></> : <><CreateAccount setToggle={setLoginToggle} /></>}
      </IonContent>
    </IonPage>
  );
}

export default Login