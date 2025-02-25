import { useState, useContext } from "react";
import "react-quill/dist/quill.snow.css";
import { useHistory } from "react-router";
import { supabase } from ".././supaBase";
import { IonButton, IonContent, IonItem, IonList } from "@ionic/react";
import "../../theme/Tab3.css";
import { UserContext } from "../../providers/userProvider";
import { Preferences } from "@capacitor/preferences";

const SignIn = ({ setToggle }: { setToggle: (value: boolean) => void }) => {
  const [email, setEmail] = useState<string>("");
  const { setLoggedIn, loggedIn } = useContext(UserContext);
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>();
  const history = useHistory();

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        setError("Email or Password Incorrect");
      }
      if (data.session?.access_token) {
        await Preferences.set({
          key: "auth_token",
          value: data.session.access_token,
        });
        localStorage.setItem("user", data?.user.email);
        history.push("/tab1");
      }
      setLoggedIn(true);
    } catch (error) {
      setLoggedIn(false);
      console.log(error);
    }
  };

  return (
    <IonContent>
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
          <div style={{ width: "75%" }} className="columnButtons">
            <IonButton
              color={"secondary"}
              shape="round"
              className="loginButton"
              onClick={() => {
                handleLogin();
              }}
            >
              Sign In
            </IonButton>
            <div style={{ textAlign: "center" }}>{error}</div>
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
