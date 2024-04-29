import { useEffect, useState, useRef, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
// import Editor from '../components/Editor';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill/core';
import { supabase } from './supaBase';
import {
    IonButton,
    IonContent,
    IonCard,
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
import '../pages/Tab3.css';



const Content: React.FC = () => {
    const [content, setContent] = useState<{ hello: [] }>();
    const [userEmail, setUserEmail] = useState<any>(localStorage.getItem('user'))
    const [value, setValue] = useState('<p>here is my values this is for a test</p><p><br></p><p>																																									this should go in the middle</p><p>idk about thiks one </p><p><br></p><p><br></p><p>lets see what happens</p><p><br></p><h1>this is a big header</h1>');


    useEffect(() => {
        getMyPosts()
    }, [])

    const getMyPosts = async () => {
        try {
            const result = await fetch(`http://localhost:3000/api/getMyPosts?email=${JSON.parse(localStorage.getItem('user') || '')}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            setContent(await result.json())
            console.log("here is important result info", await content)
        } catch (error) {
            console.log(error, "this is the create user error")
        }
    }

    console.log(localStorage.getItem('user'), "this is the current email")
    return (
        <IonContent className='page' >
            <IonList>
                {content ? <>   {content?.hello.map((stuff: any, index: number) => {
                    return (
                        <>
                            <IonCard key={index} className='card'>
                                <ReactQuill readOnly={true} theme="bubble" value={stuff.content} />
                            </IonCard>
                        </>
                    )
                })} </> : <><div>You aint got no posts</div></>}
            </IonList>
            <IonButton  onClickCapture={() => getMyPosts()}>
                Press me
            </IonButton>
        </IonContent>
    );
}

export default Content