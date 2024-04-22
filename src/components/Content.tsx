import { useEffect, useState, useRef } from 'react';
import { useApi } from '../hooks/useApi';
// import Editor from '../components/Editor';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill/core';
import { supabase } from '../components/supaBase';
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

const Content: React.FC = () => {
    const [content, setContent] = useState([]);
    const [userEmail, setUserEmail] = useState<any>()

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data, error } = await supabase.auth.getSession()
                console.log(data.session?.user.email, "this is the data")
                setUserEmail(data.session?.user.email)
            } catch (error) {
                console.log(error)
            }
        }
        getUser()
    }, [])
    

    useEffect(() => {
        getPosts()
    }, [])


    const getPosts = async () => {
        try {
            const test = await fetch(`http://localhost:3000/api/getMyPosts?email=${userEmail}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            console.log(test)
        } catch (error) {
            console.log(error, "this is the create user error")
        }
    }

    return (
        <IonPage>
            {content.map((stuff, index) => {
                return <div><ReactQuill preserveWhitespace={true} theme="bubble" value={stuff} /></div>
            })}

        </IonPage>
    );
}

export default Content