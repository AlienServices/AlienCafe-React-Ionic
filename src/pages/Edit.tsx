import { useEffect, useState, useRef, useCallback, useContext } from 'react';
// import { useHistory } from 'react-router';
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
  IonTextarea,
} from '@ionic/react';
import { supabase } from '../components/supaBase';
import './Tab1.css';
import SignIn from '../components/SignIn';
import CreateAccount from '../components/CreateAccount'
import { MyContext } from '../providers/postProvider';


const Login: React.FC = () => {
  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();
  const { posts, myPosts, setPosts, setMyPosts, updatePost, getAllPosts, updateUser, myInfo } = useContext(MyContext)
  const [bio, setBio] = useState('')
  const [userName, setUserName] = useState('')
  const { createUser } = useApi()


  return (
    <IonPage>
      <IonContent >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Page</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonItem >
          <IonTextarea onIonChange={(e) => setBio(e.detail.value ?? '')} placeholder='Bio'></IonTextarea>
        </IonItem>
        <IonItem >
          <IonInput onIonChange={(e) => setUserName(e.detail.value ?? '')} placeholder='Username'></IonInput>
        </IonItem>
        <div className='cemter'>
          <IonButton onClick={() => {updateUser(userName, bio, myInfo.following, myInfo.email); }}>Done</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default Login