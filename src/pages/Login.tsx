import { useState } from "react";
import { useHistory } from "react-router";
import "react-quill/dist/quill.snow.css";
import {
  IonContent,
  IonMenuButton,
  IonPage,
  IonImg,
  useIonViewDidLeave,
  useIonViewWillLeave,
  useIonViewWillEnter,
} from "@ionic/react";
import { supabase } from "../components/supaBase";
import "../theme/Tab1.css";
import SignIn from "../components/loginComponents/SignIn";
import CreateAccount from "../components/loginComponents/CreateAccount";

const Login: React.FC = () => {
  const history = useHistory();
  const [loginToggle, setLoginToggle] = useState<boolean>(true);
  const [visibilityToggle, setVisibilityToggle] = useState<boolean>();

  // useEffect(() => {
  //   if (user?.session.accessToken) {
  //     console.log('logged in')
  //   } else {
  //     getUser()
  //   }
  // }, [user])

  useIonViewWillLeave(() => {
    setVisibilityToggle(false)
  }, [])

  useIonViewDidLeave(() => {
    setVisibilityToggle(true)
  }, [])

  useIonViewWillEnter(() => {
    setVisibilityToggle(true)
  }, [])


  return (
    <>
      <IonPage style={{
        opacity: visibilityToggle ? "1" : "0",
        transition: "opacity 0.4s ease-in-out",
      }} id="main-content">
        <div className="brown" style={{ height: "150px" }}>
          <div className="leftMiddle">
            <div
              style={{
                borderRadius: "10px",
                backgroundColor: "white",
                width: "45px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "10px",
              }}
            >
              <IonMenuButton
                style={{ backgroundColor: "white" }}
                color={"primary"}
              />
            </div>
            <div className="logoContainer" style={{ top: "90px" }}>
              <div
                style={{
                  borderRadius: "50%",
                  overflow: "hidden",
                  width: "60px",
                  height: "60px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IonImg
                  style={{ width: "100%", height: "100%" }}
                  src="/alienLogo.svg"
                />
              </div>
            </div>
          </div>
        </div>
        <IonContent>
          {loginToggle ? (
            <>
              <SignIn setToggle={setLoginToggle} />
            </>
          ) : (
            <>
              <CreateAccount setToggle={setLoginToggle} />
            </>
          )}
        </IonContent>
      </IonPage>
    </>
  );
};

export default Login;
