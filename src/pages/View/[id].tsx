import { useEffect, useState, useRef, useCallback } from 'react';
// import { useApi } from '../hooks/useApi';
// import Editor from '../components/Editor';
import { useParams, withRouter } from 'react-router';
import ReactQuill from 'react-quill';
import { colorFill, heart, heartCircle, chatbubbleOutline } from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill/core';
import {
    IonButton,
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


const Login: React.FC = () => {
    const [content, setContent] = useState<{ id: string, content: string, likes: string, email: string, comments: string[] }[]>([]);
    const [array, setArray] = useState<[]>([])
    const [comments, setComments] = useState<string[]>([])
    const [comment, setComment] = useState<string>('')
    const [written, setWritten] = useState('')
    const { id } = useParams<{ id: string }>();
    const [value, setValue] = useState('');

    useEffect(() => {
        getOnePost()
    }, [])
    useEffect(() => {
        console.log(written, 'written stuff')
    }, [])


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

    console.log(content[0], 'testing tesitng testing')

    return (
        <IonPage >
            <IonContent>
                <IonToolbar>
                    <IonTitle>
                        Read And Add Comments
                    </IonTitle>
                </IonToolbar>
                {content.map((post: any, index: number) => {
                    return (
                        <div className='shadow'>
                            <IonCard key={index} className='card'>
                                <IonItem lines='none'>
                                    <ReactQuill readOnly={true} theme="bubble" value={post.content} />
                                </IonItem>
                                <div className='flex'>
                                    <div className='center'>
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
                <IonContent >
                    <Editor toolBar={false} theme={'snow'} value={value} setValue={setValue} />
                </IonContent>
                <div>
                    <IonButton onClick={() => {
                        setValue('')
                        updatePost([...content[0].comments, value])
                        console.log(value, content[0].comments, "this is a test")
                    }}>Add Comment</IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
}
export default Login