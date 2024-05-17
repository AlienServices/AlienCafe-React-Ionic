import { useEffect, useState, useRef, useCallback } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { IonIcon } from '@ionic/react';
import { useApi } from '../hooks/useApi';
import { colorFill, heart, heartCircle, chatbubbleOutline } from 'ionicons/icons';
// import Editor from '../components/Editor';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill/core';
import Post from '../pages/View/[id]'
import { supabase } from './supaBase';
import {
    IonButton,
    IonNav,
    IonContent,
    IonCard,
    IonNavLink,
    IonRouterLink,
    IonHeader,
    IonRoute,
    IonInput,
    IonRouterOutlet,
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
import Page from '../pages/View/[id]'
import { post } from '../utils/fetch';


const Content: React.FC = () => {
    const [content, setContent] = useState<{ id: string, content: string, likes: string, email: string }[]>([]);
    const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem('user'))
    const [value, setValue] = useState('<p>here is my values this is for a test</p><p><br></p><p>																																									this should go in the middle</p><p>idk about thiks one </p><p><br></p><p><br></p><p>lets see what happens</p><p><br></p><h1>this is a big header</h1>');
    const [likes, setLikes] = useState()
    const [toggle, setToggle] = useState(true)


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
            const posts = await result.json()
            setContent(posts.Posts)
        } catch (error) {
            console.log(error, "this is the create user error")
        }
    }


    const updatePost = async (id: string, likes: string[], postContent: string) => {
        console.log(likes, 'these are the likes I need')
        const updatedPost = await post({
            url: `http://localhost:3000/api/addLike?id=${id}`, body: {
                likes: likes,
                content: postContent
            }
        })
        console.log(updatedPost, 'an updated post')
        setContent(content.map((post) => post.id === updatedPost.update.id ? updatedPost.update : post)
        )
    }


    console.log(content, 'this is a test')

    return (
        <IonContent className='page' >
            <IonList>
                {content ? <>   {content.map((post: any, index: number) => {
                    return (
                        <div className='shadow'>
                            <IonCard key={index} className='card'>
                                <div className='emailContainer'>
                                    <div className='username'>{post.email}</div>
                                </div>
                                <IonNavLink routerDirection="forward" component={() => <Page id={post.id} />}>
                                    <IonItem lines='none'>
                                        <ReactQuill readOnly={true} theme="bubble" value={post.content} />
                                    </IonItem>
                                </IonNavLink>
                                <div className='flex'>
                                    <div className='center' onClick={() => {
                                        if (post.likes.indexOf(userEmail) === -1) {
                                            let fullLikes = [...post.likes, userEmail];
                                            updatePost(post.id, fullLikes, post.content)
                                        } else {
                                            let emailIndex = post.likes.indexOf(localStorage.getItem('user') || '')
                                            let newLikes = post.likes.toSpliced(emailIndex, 1)
                                            updatePost(post.id, newLikes, post.content)
                                        }
                                    }}>
                                        <IonIcon color='danger' size='large' icon={heartCircle} ></IonIcon>
                                        <div>{post.likes.length}</div>
                                    </div>
                                    <div className='center'>
                                        <IonIcon color='' size='large' icon={chatbubbleOutline} ></IonIcon>
                                        <div>{post.comments.length}</div>
                                    </div>
                                </div>
                                {/* <IonNavLink routerDirection="forward" component={() => <Page id={post.id} />}>
                                    <IonButton>this is the button</IonButton>
                                </IonNavLink> */}
                            </IonCard>

                        </div>
                    )
                })} </> : <><div>You aint got no post</div></>}
            </IonList>
            <IonButton onClick={() => getAllPosts()}>
                Refresh Posts
            </IonButton>


        </IonContent>
    );
}

export default Content