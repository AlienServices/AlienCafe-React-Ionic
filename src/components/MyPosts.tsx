import { useEffect, useState, useRef, useCallback } from 'react';
import { IonIcon } from '@ionic/react';
import { useApi } from '../hooks/useApi';
import { colorFill, heart, heartCircle, chatbubbleOutline, ellipsisHorizontalOutline, cartOutline } from 'ionicons/icons';
// import Editor from '../components/Editor';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill/core';
import { supabase } from './supaBase';
import {
    IonButton,
    IonFab,
    IonFabList,
    IonFabButton,
    IonRouterLink,
    IonContent,
    IonNavLink,
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
import { post } from '../utils/fetch';
import Page from '../pages/View/[id]'



const Content: React.FC = () => {
    const [content, setContent] = useState<{ id: string, content: string, likes: string, email: string }[]>([]);
    const [userEmail, setUserEmail] = useState<any>(localStorage.getItem('user'))
    const [value, setValue] = useState('<p>here is my values this is for a test</p><p><br></p><p>																																									this should go in the middle</p><p>idk about thiks one </p><p><br></p><p><br></p><p>lets see what happens</p><p><br></p><h1>this is a big header</h1>');

    useEffect(() => {
        getMyPosts()
    }, [])


    const getMyPosts = async () => {
        try {
            const result = await fetch(`http://localhost:3000/api/getMyPosts?email=${localStorage.getItem('user')}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const posts = await result.json()
            setContent(posts.Posts)
            console.log("here is important result info", await result.json())
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

    const updatePosts = async (id: string) => {
        console.log(id, 'these are the likes I need')
        const updatedPost = await post({
            url: `http://localhost:3000/api/updatePosts?id=${id}`, body: {
                id
            }
        })
        getMyPosts()
    }


    return (
        <IonContent className='page' >
            <IonList>
                {content ? <>   {content?.map((post: any, index: number) => {
                    return (
                        <div className='shadow'>
                            <IonCard key={index} className='card'>
                                <div className='fab'>
                                    <IonFab horizontal='end'>
                                        <IonFabButton size='small'>
                                            <IonIcon icon={ellipsisHorizontalOutline}></IonIcon>
                                        </IonFabButton>
                                        <IonFabList side='bottom'>
                                            <IonFabButton>
                                                <IonIcon onClick={() => {
                                                    updatePosts(post.id)
                                                }} icon={cartOutline}></IonIcon>
                                            </IonFabButton>
                                        </IonFabList>
                                    </IonFab>
                                </div>
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
                                            // debugger;
                                            let fullLikes = [...post.likes, userEmail];
                                            updatePost(post.id, fullLikes, post.content)
                                        } else {
                                            let emailIndex = post.likes.indexOf(localStorage.getItem('user') || '')
                                            let newLikes = post.likes.toSpliced(0, emailIndex)
                                            console.log(newLikes, 'thse are new likes')
                                            updatePost(post.id, newLikes, post.content)
                                        }
                                    }}>
                                        <IonIcon color='danger' size='large' icon={heartCircle} ></IonIcon>
                                        <div>{post.likes.length}</div>
                                    </div>
                                    <div>
                                        <IonIcon color='' size='large' icon={chatbubbleOutline} ></IonIcon>
                                    </div>
                                </div>
                                <div>
                                </div>

                            </IonCard>
                        </div>
                    )
                })} </> : <><div>You aint got no post</div></>}
            </IonList>
            <IonButton onClick={() => getMyPosts()}>
                Press me
            </IonButton>
        </IonContent>
    );
}

export default Content