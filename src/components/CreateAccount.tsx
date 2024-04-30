import { useEffect, useState, useRef, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from './supaBase';
import {
    IonButton,
    IonContent,
    IonCard,
    IonHeader,
    IonInput,
    IonText,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar,
    useIonToast,
    useIonLoading,
} from '@ionic/react';
import '../pages/Tab3.css';



const CreateAccount = ({ setToggle }: { setToggle: (value: boolean) => void }) => {
    const [content, setContent] = useState<{ hello: [] }>();
    const [email, setEmail] = useState<string>('');
    const [userEmail, setUserEmail] = useState<any>(localStorage.getItem('user'))
    const [password, setPassword] = useState<string>('')
    const [username, setUsername] = useState<string>()
    const [value, setValue] = useState('<p>here is my values this is for a test</p><p><br></p><p>																																									this should go in the middle</p><p>idk about thiks one </p><p><br></p><p><br></p><p>lets see what happens</p><p><br></p><h1>this is a big header</h1>');

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
            console.log('You Logged Out')
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




    return (
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
                    <IonButton onClick={() => { handleSignUp()  }}>
                        Create Account
                    </IonButton>
                    <IonButton onClick={() => { setToggle(true) }}>
                        Log In
                    </IonButton>

                </div>
                <IonText>
                    {/* {loggedIn} */}
                </IonText>
            </IonList>
        </IonContent>
    );
}

export default CreateAccount