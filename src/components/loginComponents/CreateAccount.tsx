import { useContext, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { supabase } from ".././supaBase";
import { IonButton, IonContent, IonItem, IonList } from "@ionic/react";
import "../../theme/Tab3.css";
import { MyContext } from "../../providers/postProvider";

const CreateAccount = ({
  setToggle,
}: {
  setToggle: (value: boolean) => void;
}) => {
  const [email, setEmail] = useState<string>("");
  const { getBaseUrl } = useContext(MyContext);
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const handleSignUp = async (userName: string, email: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (password.length > 5) {
        const result = await fetch(`${getBaseUrl()}/api/users/createUser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: userName,
            email: email,
          }),
        });
        setToggle(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <IonContent>
      <IonList inset={true}>
        <IonItem lines="none">
          <input
            className="loginInput"
            value={username}
            placeholder="Username"
            name="username"
            onChange={(e) => setUsername(e.target.value ?? "")}
            type="text"
          ></input>
        </IonItem>
        <IonItem lines="none">
          <input
            className="loginInput"
            value={email}
            placeholder="E`mail"
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
        <div className="center">
          <div style={{ width: "85%" }} className="columnButtons">
            <IonButton
              color={"secondary"}
              shape="round"
              className="loginButtonRounded"
              onClick={() => {
                handleSignUp(username, email);
              }}
            >
              Create Account
            </IonButton>
            <div className="center">
              <div style={{ margin: "10px", color: "rgb(138,140,140)" }}>
                Or
              </div>

              <div
                className="grayWord"
                onClick={() => {
                  setToggle(true);
                }}
              >
                Already registered? <div className="blueWord">Login</div>
              </div>
            </div>
          </div>
        </div>
      </IonList>
    </IonContent>
  );
};

export default CreateAccount;
