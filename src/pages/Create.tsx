import { useEffect, useState, useRef, useCallback, useContext } from "react";
import { useApi } from "../hooks/useApi";
import Editor from "../components/Editor";
import "react-quill/dist/quill.snow.css";
import Styles from "../theme/myVariables.css";
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
} from "@ionic/react";
import { supabase } from "../components/supaBase";
import { ContextProvider } from "../providers/postProvider";
import "./Tab1.css";
import { MyContext } from "../providers/postProvider";

const Create: React.FC = () => {
  const [email, setEmail] = useState<string | null>(
    localStorage.getItem("user"),
  );
  const { createPost } = useContext(MyContext);
  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>();
  const [range, setRange] = useState();
  const [lastChange, setLastChange] = useState();
  const [readOnly, setReadOnly] = useState(false);
  const [value, setValue] = useState("");

  // const [values, setValues] = useContext(ContextProvider)
  const { createUser } = useApi();

  const create = async () => {
    if (email && username) {
      const result = await createUser(email, username);
      console.log(result, "this is the create user result");
    } else {
      console.log("there is an error");
    }
  };

  const imageHandler = useCallback(() => {
    console.log("hititng handler");
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

  // const createPost = async () => {
  //     try {
  //         const test = await fetch('http://localhost:3000/api/createPost', {
  //             method: "POST",
  //             headers: {
  //                 'Content-Type': 'application/json'
  //             },
  //             body: JSON.stringify({
  //                 content: value,
  //                 email: localStorage.getItem('user') || ''
  //             })
  //         })
  //     } catch (error) {
  //         console.log(error, "this is the create user error")
  //     }
  // }

  console.log(email, "this is the email");
  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>          
          <div className="end">
            <IonButton
              onClick={() => {
                createPost(value);
                setValue("");
              }}
            >
              Next
            </IonButton>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Editor
          toolBar={true}
          theme={"snow"}
          value={value}
          setValue={setValue}
        />
      </IonContent>
    </IonPage>
  );
};

export default Create;
