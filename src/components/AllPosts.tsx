import { useEffect, useState, useRef, useCallback } from 'react';
import { IonIcon } from '@ionic/react';
import { useApi } from '../hooks/useApi';
import { colorFill, heart, heartCircle, chatbubbleOutline } from 'ionicons/icons';
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
    const [content, setContent] = useState<{ hello: [id: string, content: string, likes: string] }>();
    const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem('user'))
    const [value, setValue] = useState('<p>here is my values this is for a test</p><p><br></p><p>																																									this should go in the middle</p><p>idk about thiks one </p><p><br></p><p><br></p><p>lets see what happens</p><p><br></p><h1>this is a big header</h1>');
    const [likes, setLikes] = useState()

    useEffect(() => {
        getAllPosts()
    }, [])

    const getAllPosts = async () => {
        try {
            const result = await fetch(`http://localhost:3000/api/getPosts`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            // console.log(await result.json(), 'this is the result')
            setContent(await result.json())
        } catch (error) {
            console.log(error, "this is the create user error")
        }
    }


    const likePost = async (id: string, likes: string[], email: string) => {

        try {
            if (likes.indexOf(localStorage.getItem('user')) === -1) {
                const test = await fetch(`http://localhost:3000/api/addLike?id=${id}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        likes: likes,
                        email: localStorage.getItem('user')
                    })
                })

            }
        } catch (error) {
            console.log(error, "this is the create user error")
        }
    }
    const dislikePost = async (id: string, likes: string[], email: string) => {

        try {
            if (likes.indexOf(localStorage.getItem('user')) === -1) {
                const test = await fetch(`http://localhost:3000/api/addLike?id=${id}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        likes: likes,
                        email: localStorage.getItem('user')
                    })
                })

            }
        } catch (error) {
            console.log(error, "this is the create user error")
        }
    }

    return (
        <IonContent className='page' >
            <IonList>
                {content ? <>   {content?.Hello.map((post: any, index: number) => {
                    return (
                        <div className='shadow'>
                            <IonCard key={index} className='card'>
                                <IonItem lines='none'>
                                    <ReactQuill readOnly={true} theme="bubble" value={post.content} />
                                </IonItem>
                                <div className='flex'>
                                    <div className='center' onClick={() => {if('') {likePost(post.id, post.likes, post.email)} else {dislikePost(post.id, post.likes, post.email)}  }}>
                                        <IonIcon color='danger' size='large' icon={heartCircle} ></IonIcon>
                                        <div>{post.likes.length}</div>
                                    </div>
                                    <div>
                                        <IonIcon color='' size='large' icon={chatbubbleOutline} ></IonIcon>
                                    </div>
                                </div>
                            </IonCard>
                        </div>
                    )
                })} </> : <><div>You aint got no post</div></>}
            </IonList>
            <IonButton onClick={() => getAllPosts()}>
                Press me
            </IonButton>
        </IonContent>
    );
}

export default Content