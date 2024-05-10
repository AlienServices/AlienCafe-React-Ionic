import { useEffect, useState, useRef, useCallback } from 'react';
// import { useApi } from '../hooks/useApi';
// import Editor from '../components/Editor';
import { useParams } from 'react-router';
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



const Login: React.FC = () => {
    const [content, setContent] = useState([])
    const [array, setArray] = useState<[]>([])
    const { id } = useParams<{ id: string }>();
    console.log(id, 'this is the current id')


    useEffect(() => {
        getOnePost()
        // if (array.length < 2 && content) {
        //     debugger
        //     array.push(content)
        // }
    }, [])


    const getOnePost = async () => {
        try {
            const result = await fetch(`http://localhost:3000/api/getPost?id=${id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            setContent(await result.json())
            //  console.log(content, 'this is content')
        } catch (error) {
            console.log(error, "this is the create user error")
        }
    }
    // console.log(typeof content.Hello, 'should be an array')
    console.log(content, "this shoudl be converted to an array")    
    return (
        <IonPage>            
            {content?.Hello?.map((post: any, index: number) => {
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
        </IonPage>
    );
}

export default Login