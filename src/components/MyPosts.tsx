import { useEffect, useState, useRef, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
// import Editor from '../components/Editor';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './content.css'
import Quill from 'quill/core';
import { supabase } from './supaBase';
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
    const [content, setContent] = useState(['<p>here is my values this is for a test</p><p><br></p><p>', '<p>here is my values this is for a test</p><p><br></p><p>', '<p>here is my values this is for a test</p><p><br></p><p>', '<p>here is my values this is for a test</p><p><br></p><p>']);
    const [userEmail, setUserEmail] = useState<any>()
    const [value, setValue] = useState('<p>here is my values this is for a test</p><p><br></p><p>																																									this should go in the middle</p><p>idk about thiks one </p><p><br></p><p><br></p><p>lets see what happens</p><p><br></p><h1>this is a big header</h1>');


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

    // modules = {
    //     toolbar: [["bold", "italic", "image"]],
    //     imageUploader: {
    //         upload: (file) => {
    //             return new Promise((resolve, reject) => {
    //                 const formData = new FormData();
    //                 formData.append("image", file);

    //                 fetch(
    //                     "https://api.imgbb.com/1/upload?key=d36eb6591370ae7f9089d85875e56b22",
    //                     {
    //                         method: "POST",
    //                         body: formData
    //                     }
    //                 )
    //                     .then((response) => response.json())
    //                     .then((result) => {
    //                         console.log(result);
    //                         resolve(result.data.url);
    //                     })
    //                     .catch((error) => {
    //                         reject("Upload failed");
    //                         console.error("Error:", error);
    //                     });
    //             });
    //         }
    //     }
    // };


    // useEffect(() => {
    //     getMyPosts()
    // }, [userEmail])


    // const getMyPosts = async () => {
    //     try {
    //         const result = await fetch(`http://localhost:3000/api/getMyPosts?email=${userEmail}`, {
    //             method: "GET",
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //         })
    //         setContent(await result.json())            
    //     } catch (error) {
    //         console.log(error, "this is the create user error")
    //     }
    // }


    const imageHandler = useCallback(() => {
        console.log("hititng handler")
        // const input = document.createElement("input");
        // input.setAttribute("type", "file");
        // input.setAttribute("accept", "image/*");
        // input.onchange = async () => {
        //   if (input !== null && input.files !== null) {
        //     const file = input.files[0];
        //     console.log(file, "cuss word")
        //   }
        // };
    }, []);



    return (
        <IonPage className='ion-align-items-center' >
            <ReactQuill modules={{
                toolbar: {
                    container: [
                        [{ header: "1" }, { header: "2" }, { font: [] }],
                        [{ size: [] }],
                        ["bold", "italic", "underline", "strike", "blockquote"],
                        [
                            { list: "ordered" },
                            { list: "bullet" },
                            { indent: "-1" },
                            { indent: "+1" },
                        ],
                        ["link", "image", "video"],
                        ["code-block"],
                        ["clean"],
                    ],
                    handlers: {
                        image: imageHandler()
                    }
                },
                clipboard: {
                    matchVisual: false,
                },
            }} preserveWhitespace={true} theme="snow" value={value} onChange={setValue} />
            {content?.map((stuff: any) => {
                return <ReactQuill preserveWhitespace={true} readOnly={true} theme="bubble" value={stuff} />
            })}
            {/* <ReactQuill preserveWhitespace={true} theme="bubble" value={value} /> */}

        </IonPage>
    );
}

export default Content