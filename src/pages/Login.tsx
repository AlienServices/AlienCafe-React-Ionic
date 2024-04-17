import { useState } from 'react';
import {
  IonButton,
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

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();
  const [password, setPassword] = useState()
  const [username, setUsername] = useState()


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    const { data, error } = await supabase.auth.signUp({
      email: 'example@email.com',
      password: 'example-password',
    })
  };



  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="ion-padding">
          <h1>Supabase + Ionic React</h1>
          <p>Sign in via magic link with your email below</p>
        </div>
        <IonList inset={true}>
          <form>
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput
                value={email}
                name="email"
                onIonChange={(e) => setEmail(e.detail.value ?? '')}
                type="email"
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">First Name</IonLabel>
              <IonInput
                value={email}
                name="email"
                onIonChange={(e) => setEmail(e.detail.value ?? '')}
                type="email"
              ></IonInput>
            </IonItem>
            <div className="ion-text-center">
              <IonButton type="submit" fill="clear">
                Login
              </IonButton>
            </div>
          </form>
        </IonList>
      </IonContent>
    </IonPage>
  );
}

export default Login