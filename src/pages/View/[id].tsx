import { useEffect, useState, useRef, useCallback } from 'react';
// import { useApi } from '../hooks/useApi';
// import Editor from '../components/Editor';
import { useParams, withRouter } from 'react-router';
import ReactQuill from 'react-quill';
import { colorFill, heart, heartCircle, chatbubbleOutline, bookmarkOutline, shareOutline, arrowBackOutline, backspaceOutline } from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill/core';
import {
    IonButton,
    IonTextarea,
    IonAvatar,
    IonButtons,
    IonBackButton,
    IonCard,
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
    IonIcon,
    IonRouterLink,
    useIonLoading,
} from '@ionic/react';
import { post } from '../../utils/fetch';
import Editor from '../../components/Editor';
import '../../theme/id.module.css';


const Login = ({ id }: { id: string }) => {
    const [content, setContent] = useState<{ id: string, content: string, likes: string, email: string, comments: string[] }[]>([]);
    const [array, setArray] = useState<[]>([])
    const [comments, setComments] = useState<string[]>([])
    const [comment, setComment] = useState<string>('')
    const [written, setWritten] = useState('')
    const [value, setValue] = useState('');

    useEffect(() => {
        getOnePost()
    }, [])
    useEffect(() => {
        console.log(value, 'vallllllue')
    }, [value])


    const getOnePost = async () => {
        try {
            const result = await fetch(`http://localhost:3000/api/getPost?id=${id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const post = await result.json()
            console.log(post.Hello, 'this is post')
            setContent(post.Hello)
        } catch (error) {
            console.log(error, "this is the create user error")
        }
    }


    const updatePost = async (comments: string[]) => {
        const updatedPost = await post({
            url: `http://localhost:3000/api/addLike?id=${id}`, body: {
                comments: comments
            }
        })
        console.log(updatedPost, 'an updated post')
        setContent(content.map((post) => post.id === updatedPost.update.id ? updatedPost.update : post)
        )
    }

    // const handleKeyDown = () => {
    //     if (e.key === 'Enter') {
    //         setValue('')
    //     }
    // }


    return (
        <IonPage >
            <IonContent>
                <IonHeader>
                    <IonToolbar>
                        <IonRouterLink href={`/tab3`}>
                            <IonIcon size='large' icon={arrowBackOutline}></IonIcon>
                        </IonRouterLink>

                    </IonToolbar>
                </IonHeader>
                {content.map((post: any, index: number) => {
                    return (
                        <div className='shadow'>
                            <IonCard style={{ borderBottom: "1px solid lightgray", marginBottom: '25px' }} key={index} className='card'>
                                <div className='around'>
                                    <div style={{ padding: "8px" }} className='emailContainer'>
                                        <IonAvatar style={{ height: '20px', width: '20px', marginLeft: '10px', marginRight: '5px' }}>
                                            <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                                        </IonAvatar>
                                        <div className='username'>{post.email}</div>
                                    </div>
                                    <div>
                                        {/* <IonButton size='small'>Follow</IonButton> */}
                                    </div>
                                </div>
                                <ReactQuill style={{ color: 'black' }} readOnly={true} theme="bubble" value={post.content} />
                                <div className='around'>
                                    <div className='flex'>
                                        <div className='center' onClick={() => {
                                            // if (post.likes.indexOf(userEmail) === -1) {
                                            //     let fullLikes = [...post.likes, userEmail];
                                            //     updatePost({ id: post.id, likes: fullLikes, content: post.content, email: post.email })
                                            // } else {
                                            //     let emailIndex = post.likes.indexOf(localStorage.getItem('user') || '')
                                            //     let newLikes = post.likes.toSpliced(emailIndex, 1)
                                            //     console.log(newLikes, 'thse are new likes')
                                            //     updatePost({ id: post.id, likes: newLikes, content: post.content, email: post.email })
                                            // }
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
                                    <div className='centerColumn'>
                                        <IonIcon color='' size='small' icon={shareOutline} ></IonIcon>
                                    </div>
                                </div>
                            </IonCard>
                        </div>
                    )
                })}
                <IonItem>
                    <div className='column' style={{ width: "100%" }}>
                        {content[0]?.comments.map((comments: any, index: number) => {
                            return (
                                <IonCard>
                                    <IonItem lines='none'>
                                        <ReactQuill readOnly={true} theme="bubble" value={comments} />
                                    </IonItem>
                                    <IonButton onClick={(e) => {
                                        let newComments = content[0]?.comments.toSpliced(index, 1)
                                        console.log(newComments, index, 'this is the index and spliced array')
                                        updatePost(newComments)
                                    }}>
                                        delete me
                                    </IonButton>
                                </IonCard>
                            )
                        })}
                    </div>
                </IonItem>
                <div className='flexWide'>
                    {/* <Editor toolBar={false} theme={'snow'} value={value} setValue={setValue} /> */}
                    <IonItem>
                        <IonTextarea value={value}  onIonInput={(e: any) => {setValue(e.target.value)}}></IonTextarea>
                    </IonItem>
                    <div>
                        <IonButton size='small' onClick={(e) => {
                            setValue('')
                            updatePost([...content[0].comments, value])
                            getOnePost()
                            // handleKeyDown(e, [...content[0].comments, value])
                        }}>Add Comment</IonButton>
                    </div>
                </div>

            </IonContent>
        </IonPage>
    );
}
export default Login