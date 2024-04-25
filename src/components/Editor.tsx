import { IonPage, IonButton } from '@ionic/react';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../pages/Tab1.css'



const Editor = ({ value, setValue }: {
  value: string;
  setValue: (value: string) => void;
}) => {
  // const [value, setValue] = useState('');



  return (
    <IonPage>
      <div className='quillCenter'>
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
            // handlers: {
            //   image: imageHandler()
            // }
          },
          clipboard: {
            matchVisual: false,
          },
        }} theme="snow" value={value} onChange={setValue} />
      </div>
    </IonPage>
  )
}

export default Editor