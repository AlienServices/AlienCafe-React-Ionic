import { useEffect, useState, useRef, useCallback } from 'react';
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
const Delta = Quill.import('delta');

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();
  const [password, setPassword] = useState<string>('')
  const [username, setUsername] = useState<string>()
  const [user, setUser] = useState()
  const [localEmail, setLocalEmail] = useState(localStorage.getItem('user'))
  const [loggedIn, setLoggedIn] = useState('logged out')
  const { createUser } = useApi()

  useEffect(() => {
    if (localEmail) {
      setLoggedIn('logged in')
    } else{
      setLoggedIn('logged out')
    }
  }, [])


  // const create = async () => {
  //   if (email && username) {
  //     const result = await createUser(email, username)
  //     console.log(result, "this is the create user result")
  //   } else {
  //     console.log('there is an error')
  //   }
  // }

  const handleSignUp = async () => {
    console.log('kale')
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      })
      console.log(error, data, "create user info")
    } catch (error) {
      console.log(error)
    }
  };

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })
      if (error) {
        console.log(error, "this is the login error")
      }
      if (data) {
        localStorage.setItem('user', JSON.stringify(data.user?.email))
        console.log(data, "this is login data")
      }
    } catch (error) {
      console.log(error)
    }
  }


  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.log("this is logout error", error)
      }
    } catch (error) {
      console.log(error)
    }
  }


  const getUser = async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      localStorage.setItem('user', JSON.stringify(data))
      console.log(data, "this is the data")
    } catch (error) {
      console.log(error)
    }
  }


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
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>

        <IonList inset={true}>
          <IonItem>
            <IonInput
              value={username}
              placeholder='username'
              name="username"
              onIonChange={(e) => setUsername(e.detail.value ?? '')}
              type="text"
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonInput
              value={password}
              placeholder='password'
              name="password"
              onIonChange={(e) => setPassword(e.detail.value ?? '')}
              type="password"
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonInput
              value={email}
              placeholder='email'
              name="email"
              onIonChange={(e) => setEmail(e.detail.value ?? '')}
              type="email"
            ></IonInput>
          </IonItem>
          <div className="ion-text-center">
            <IonButton onClick={() => { handleSignUp() }}>
              Sign Up
            </IonButton>
            <IonButton onClick={() => { handleLogin() }}>
              Log In
            </IonButton>
            <IonButton onClick={() => { getUser() }}>
              Am I logged in?
            </IonButton>
            <IonButton onClick={() => { handleLogout(); localStorage.clear() }}>
              Log Out
            </IonButton>
          </div>
          <IonText>
            {loggedIn}
          </IonText>
        </IonList>
      </IonContent>
    </IonPage>
  );
}

export default Login