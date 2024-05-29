import { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { IonIcon } from '@ionic/react';
import { useApi } from '../hooks/useApi';
import { colorFill, heart, heartCircle, chatbubbleOutline, bookmarkOutline, shareOutline, checkmarkOutline } from 'ionicons/icons';
// import Editor from '../components/Editor';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill/core';
import Post from '../pages/View/[id]'
import { supabase } from './supaBase';
import {
    IonButton,
    IonNav,
    IonChip,
    IonAvatar,
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
import Profile from '../pages/Profile/[id]'
import { post } from '../utils/fetch';
import { MyContext } from '../providers/postProvider';
import moment from 'moment'



const Content: React.FC = () => {
    const [content, setContent] = useState<{ id: string, content: string, likes: string, email: string }[]>([]);
    const { posts, myPosts, setPosts, setMyPosts, updatePost, getAllPosts, myInfo, updateUser, getUserPosts } = useContext(MyContext)
    const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem('user'))
    const [value, setValue] = useState('<p>here is my values this is for a test</p><p><br></p><p>																																									this should go in the middle</p><p>idk about thiks one </p><p><br></p><p><br></p><p>lets see what happens</p><p><br></p><h1>this is a big header</h1>');
    const [user, setUser] = useState<{ bio: string, email: string, followers: string[], following: string[], id: string, username: string }>({ bio: '', email: '', followers: [], following: [], id: '', username: '' })
    const [toggle, setToggle] = useState(true)


    useEffect(() => {
        getUser()
    }, [])


    const getUser = async () => {
        try {
            const result = await fetch(`http://localhost:3000/api/myInfo?email=${localStorage.getItem('user')}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const userInfo = await result.json()
            setUser(userInfo.Hello)
            console.log(userInfo, 'this is user result')
        } catch (error) {
            console.log(error, "this is the create user error")
        }
    }


    console.log(myInfo, 'me')
    return (
        <IonContent className='page' >
            <IonList>
                {posts ? <>   {posts.sort((a, b) => Date.parse(b?.date) - Date.parse(a?.date)).map((post: any, index: number) => {

                    var parser = new DOMParser()
                    var doc = parser.parseFromString(post.content, 'text/html');
                    var output = Array.prototype.slice.call(
                        doc.querySelectorAll('h1')
                    ).map(el => el.outerHTML);

                    const date = new Date(post.date)
                    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
                    const day = String(date.getUTCDate()).padStart(2, '0');
                    const year = date.getUTCFullYear();

                    // Format the date as mm/dd/yyyy
                    const formattedDate = `${month}/${day}/${year}`;

                    return (
                        <div className='shadow'>
                            <IonCard style={{ boxShadow: 'none', borderTop: "1px solid #eaeaea", borderRadius: "0px", paddingTop: '10px', paddingBottom: '10px' }} key={post.id} className='card'>
                                <div className='around'>
                                    <div className='emailContainer'>
                                        <IonAvatar style={{ height: '20px', width: '20px', marginLeft: '10px', marginRight: '5px' }}>
                                            <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                                        </IonAvatar>
                                        <IonNavLink onClick={(() => { getUserPosts(post.email)})} routerDirection="forward" component={() => <Profile id={post.email} />}>
                                            <div className='username'>{post.email}</div>
                                        </IonNavLink>
                                    </div>
                                    <div>
                                        {myInfo?.email !== post?.email ? <> {myInfo?.following?.indexOf(post.email) !== -1 ? <div> <IonButton onClick={() => {
                                            let emailIndex = myInfo?.following?.indexOf(post.email)
                                            let newLikes = myInfo?.following?.toSpliced(emailIndex, 1)
                                            updateUser(myInfo?.username, myInfo?.bio, [...newLikes], myInfo.email)
                                        }} size='small'>{"<3"}</IonButton></div> : <div> <IonButton onClick={() => {
                                            updateUser(user?.username, user?.bio, [...user.following, post.email], myInfo.email)
                                        }} size='small'>Follow</IonButton></div>}</> : <>Its you Mf</>}
                                    </div>
                                </div>
                                <IonNavLink routerDirection="forward" component={() => <Page id={post.id} />}>
                                    <ReactQuill style={{ color: "black" }} readOnly={true} theme="bubble" value={output[0]} />
                                </IonNavLink>
                                <div className='around'>
                                    <div className='flex'>
                                        <div className='center' onClick={() => {
                                            if (post.likes.indexOf(userEmail) === -1) {
                                                let fullLikes = [...post.likes, userEmail];
                                                updatePost({ id: post.id, likes: fullLikes, content: post.content, email: post.email })
                                            } else {
                                                let emailIndex = post.likes.indexOf(localStorage.getItem('user') || '')
                                                let newLikes = post.likes.toSpliced(emailIndex, 1)
                                                console.log(newLikes, 'thse are new likes')
                                                updatePost({ id: post.id, likes: newLikes, content: post.content, email: post.email })
                                            }
                                        }}>
                                            <IonIcon color='danger' size='small' icon={heartCircle} ></IonIcon>
                                            <div>{post.likes.length}</div>
                                        </div>
                                        <div className='center'>
                                            <IonIcon color='' size='small' icon={chatbubbleOutline} ></IonIcon>
                                            <div>{post.comments.length}</div>
                                        </div>
                                        <div className='center'>
                                            <IonIcon color='' size='small' icon={bookmarkOutline} ></IonIcon>
                                        </div>
                                    </div>
                                    <div className='flex'>
                                        <div>{formattedDate}</div>
                                        <IonIcon color='' size='small' icon={shareOutline} ></IonIcon>
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
            {/* <IonButton onClick={() => getAllPosts()}>
                Refresh Posts
            </IonButton> */}
        </IonContent>
    );
}

export default Content