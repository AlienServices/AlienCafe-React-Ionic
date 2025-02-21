import React, { useState, useEffect, useRef, useContext } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../theme/create.css";
import Editor from "../../components/Editor";
import {
  IonContent,
  IonPage,
  IonFooter,
  useIonViewDidLeave,
} from "@ionic/react";
// import { Keyboard } from '@capacitor/keyboard';

import Quiz from "../../subPages/Quiz";
import { UserContext } from "../../providers/userProvider";
import HeaderAlien from "../../components/preRender/Header";

const MyEditor = () => {
  const [editorHtmlTitle, setEditorHtmlTitle] = useState("");
  const [editorHtml, setEditorHtml] = useState("");
  const [editorLinks, setEditorLinks] = useState("");
  const [isTitle, setIsTitle] = useState(false);
  const [isContent, setIsContent] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const { loggedIn, myInfo } = useContext(UserContext);
  const contentQuillRef = useRef<ReactQuill | null>(null);
  const titleQuillRef = useRef<ReactQuill | null>(null);



  const profileImage = (id: string) => {
    if (id) {
      const newProfileImageUri = `${import.meta.env.VITE_APP_SUPABASE_URL}/storage/v1/object/public/ProfilePhotos/${id}.jpg`;
      return newProfileImageUri;
    }
  };


  // const handleSourceClick = (e: boolean) => {
  //   setIsReplying(e);
  //   setTimeout(() => {
  //     sourceQuillRef.current?.getEditor();
  //   }, 400);
  // };

  useIonViewDidLeave(() => {
    setEditorHtml("");
    setEditorHtmlTitle("");
  }, []);


  return (
    <IonPage>
      <HeaderAlien
        backArrowToggle={false}
        next={false}
        content={editorHtml}
        title={editorHtmlTitle}
      />
      <IonContent>
        {loggedIn ? (
          <div style={{ width: '160px' }} className="centerRow">
            <img
              className="profile-photo"
              src={`${profileImage(myInfo?.id)}`}
              alt=""
            />
            {myInfo?.username}
          </div>
        ) : (
          <div style={{ width: '300px' }} className="centerRow">
            <img
              className="profile-photo"
              src={"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAoQMBIgACEQEDEQH/xAAbAAEAAQUBAAAAAAAAAAAAAAAABgEDBAUHAv/EADkQAAICAQICBgcHAwUBAAAAAAABAgMEBREhMQYSQVFhcRMUIiOBkdEyQmJyobHBUlPhMzVzg/Ak/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAER/9oADAMBAAIRAxEAPwDuIAAAAAUckub2MHVNVx9Oh72XWsa3jWub+iIdqWrZWoP3s+rVvwqhy+PeBJ87pHg4zca275r+3yXxNJldJs63hTGuleC3fzf0NIAMm3Uc25+8yrn5TaMdylJ+02/iUABNrk2mZFWdl0teiybo/wDYzHAG4xukmfTsrJQuj+OOz+aN1g9JsS9qGRGVEn2y4x+ZDQB02FkLIKdclOL5Si90z0c6wNRysCalj27L70HxjImGka3RqKUH7q/bjXJ8/J9oG1BRPcqAAAAAAAAANLrutxwI+io2nktcuyHi/oZGuanHTcXeOzvnuq4/z5Igllk7bJWWScpye8m+bYC2yd1krLZuc5Pdyb5nkAAAAAAAAAAAABVNxalFtSXJrmigAl2ga8shxxc1pXcoWPlPwfiSE5gntybRNOjmrevVegyJb5Na33/rj3gbsAAAAAPF1kaa5WWPqwgnKT7kj2R7pdmuvHrxK3tK3jP8q/z+wEb1POnqGZO+XBPhCPdHsMUAAAAABQCoMzB0zKzuNMEof1ye0f8APwNvV0YW292U9+1Qj9Qmo4CSWdF69n6LKlv2daKNXm6PmYS604KyC+/Xx28+4GteAAoAABdxcizFvhfS9pwe68fAtADpGDkwzMWvIr+zNb7d3ei+RTofm9W23Dm/ZkuvX4PtRKwAAAEA1/I9a1W+W+8YvqRXclw/fcneRYqcey18oQcvkjmjcpPrS4yfFvxAAAAAABudA0n1x+sZCfoIvgv639DU01yuurqh9qclFfHgT+imGPTCmv7EEooJXqMVGKjFKKS2SXYVADIAAI10g0eNcHl4kdorjZWuzxRHzojSknGS3TWzXgQTUsb1TOuo7Iy9ny5oNRjAAKAAC/gXvFzab09upNN+Xb+m50eLTSa5PkcxOhaLc79JxbJfa9Gk/NcH+wGaAAMHXJdTSMpr+20c+J/r630bL/IQAAAAAAA2GgxUtWx+t2Nv9GTUgml3LH1DHtl9lTSfk+DJ2GaAAIAAARLpVFLUotc3Wt/1JaQ3pHcrtVtUeVaUPr+oWNYAA0AAATfopJy0eCf3ZyX6kIJr0S/2hf8AJIDdAADF1St26blQS3bqlt57HOt9+J058Vszm+ZQ8bLupfOE2gLIAAAAATLQdQWZiKE5bX1JKS712Mhpcx77Ma2NtE3CcXumgljoINLp/SCi6Khle5t7/uP6G4hZCxJ1TjNPk4y3DOPQKSlGK3lJJeL2NXna9iY0Wqn6azklF8F5sGMnVc+On4srHs5tbVx739CDyk5ycpPeTe7Zezcu7Nvd18t2+CS5RXciwGpMAAFAAAJ30ar9Ho2P+LeXzbILGLlJRjzk9l5nSMSlY+LVSuVcFH5IC8AABDel2J6LPjkpezfHj+ZcP22JkYGt4Sz8CypJekXtV7/1IDn4DTi3FpprdNMACsU5NRinKT4JJbtsp8SVdHdLVFay8iPvZr2Iv7i+oHjSdAhUo250VOzsrfKPn3stap0ee8rcDlzdL/h/wSMBjXPLap0zcLoShNc1JbM8xk4veDafhwOg3UVXx6t1ULF+OKZg2aFp0+KocH+Gb2+QXUNlKUvtyk/NiMZTkowjKTfJJb7kxhoGmx50yl+abM6jFx8b/QphX+WIXUb0zo/Zc42Zu9VfPqb+0/PuNhqeg0ZFbliRVNsVwS5S8/qbkBNc8tqspslXbBxnF7NM8ky1zS1nUdepJZEF7P4l3MhrTTaaaaez8AugACtp0cxPWtUr3W8KfeS+HL9Sdmn6MYDw8BWWR2uu9qXel2L/AN3m4AAAAAAIj0q0v0VrzqI+xN+9S+6+/wCJHjpltcba5QsipQktmn2og2t6RPTbutBOWNN+xLu8GB50LC9dzkpreqv2579vcvmTQ0/RfHVWnu1raVst/guC/k3AZoAAgAAAAAAAARPpNhKjKjk1raF32kuyRLDX69j+saXckvaguvH4f43CxCjb9HNM9eyldZH/AOep7vf70u4xdK027UshV17qtcZzfKK+pPMXGqxaIU0R6sIrgg0u7FQAAAAAAAW7qa76pVWxU4SWzi+0uADFhjRx6YVVL2IJJLtBkniValxXBhLFkHpwkua4HkMgAAAAAAVjGT5IChVVeki4yW8Wtn4l2Ne3M9hqRZw8SnDojTjw6kI/r4svgBQAAAAAAAAAAAABTt2KSinzQASrcoKPFbnhgBKLmeowUue5UAe1FI9IALFQAFAAAAAAAAf/2Q=="}
              alt=""
            />
            You Need To Login
          </div>
        )}

        <div className="editorContainer">
          <div className="titleEditor">
            <Editor value={editorHtmlTitle} setValue={setEditorHtmlTitle} styling={'custom-content-editor-title'} description={'Title/Thesis'} />
            <Editor value={editorHtml} setValue={setEditorHtml} styling={'custom-content-editor'} description={'Enter your supporting narrative and photos'} />
            <Editor value={editorLinks} setValue={setEditorLinks} styling={'custom-content-editor'} description={'Links to sources'} />
          </div>
          <Quiz content={editorHtml} title={editorHtmlTitle} links={editorLinks} />
        </div>
      </IonContent>
    </IonPage>
  );
};

MyEditor.titleModules = {
  toolbar: {
    container: "#toolbar-title"
  },
  clipboard: {
    matchVisual: false,
  },
};

MyEditor.titleFormats = ["header"];

MyEditor.modules = {
  toolbar: {
    container: "#toolbar",
  },
};

MyEditor.formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "link",
  "image",
  "video",
  "code-block",
  "list",
  "bullet",
  "indent",
];

export default MyEditor;
