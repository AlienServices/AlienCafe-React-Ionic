import { useEffect, useState, useRef, useCallback, useContext } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation, useHistory } from "react-router";
import useNavigate from "react-router";
import { supabase } from "./supaBase";
import {
  IonButton,
  IonContent,
  IonCard,
  IonHeader,
  IonInput,
  IonText,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
  useIonLoading,
} from "@ionic/react";
import "../theme/Tab3.css";
import { MyContext } from "../providers/postProvider";

const SignIn = ({ setToggle }: { setToggle: (value: boolean) => void }) => {
  const [content, setContent] = useState<{ hello: [] }>();
  const [email, setEmail] = useState<string>("");
  const {
    posts,
    myPosts,
    setPosts,
    setMyPosts,
    updatePost,
    getAllPosts,
    setLoggedin,
    loggedIn,
  } = useContext(MyContext);
  const [userEmail, setUserEmail] = useState<any>(localStorage.getItem("user"));
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>();
  const [error, setError] = useState<string>();
  const history = useHistory();

  // const [value, setValue] = useState('<p>here is my values this is for a test</p><p><br></p><p>																																									this should go in the middle</p><p>idk about thiks one </p><p><br></p><p><br></p><p>lets see what happens</p><p><br></p><h1>this is a big header</h1>');

  const handleSignUp = async () => {
    console.log("kale");
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      console.log(error, data, "create user info");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        console.log(error, "this is the login error");
        setError("Email or Password Incorrect");
      }
      if (data.user?.email) {
        localStorage.setItem("user", data.user.email);
        console.log(data, "this is login data");
        history.push("/tab3");
      }
      setLoggedin(!loggedIn);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    console.log('hitting logout in all sign in')
    try {
      const { error } = await supabase.auth.signOut();
      console.log("You Logged Out");
      if (error) {
        console.log("this is logout error", error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      localStorage.setItem("user", JSON.stringify(data));
      console.log(data, "this is the data");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <IonContent >
      <IonList inset={true}>
        <IonItem lines="none">
          <input
            className="loginInput"
            value={email}
            placeholder="Email"
            name="email"
            onChange={(e) => setEmail(e.target.value ?? "")}
            type="email"
          ></input>
        </IonItem>
        <IonItem lines="none">
          <input
            className="loginInput"
            value={password}
            placeholder="Password"
            name="password"
            onChange={(e) => setPassword(e.target.value ?? "")}
            type="password"
          ></input>
        </IonItem>
        <div className="forgotPassword">
          <div className="forgot">Forgot password?</div>
        </div>
        <div className="center">
          <div style={{ width: "85%" }} className="columnButtons">
            <IonButton
              className="loginButton"           
              onClick={() => {
                handleLogin();
              }}
            >
              Sign In
            </IonButton>
            <div style={{ textAlign: 'center' }}>{error}</div>
            <div className="center">
              <div style={{ margin: "10px", color: "rgb(138,140,140)" }}>
                Or
              </div>
              <div
                className="createAccount"
                onClick={() => {
                  setToggle(false);
                }}
              >
                Create Account
              </div>
            </div>
          </div>
        </div>
      </IonList>
    </IonContent>
  );
};

export default SignIn;
