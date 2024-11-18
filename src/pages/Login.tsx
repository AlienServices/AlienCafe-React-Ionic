import { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router";
import "react-quill/dist/quill.snow.css";
import {
  arrowBackCircleOutline,
} from "ionicons/icons";
import {
  IonContent,
  IonMenuButton,
  IonPage,
  IonIcon,
  useIonToast,
  useIonLoading,
  IonImg,
} from "@ionic/react";
import { supabase } from "../components/supaBase";
import "../theme/Tab1.css";
import SignIn from "../components/loginComponents/SignIn";
import CreateAccount from "../components/loginComponents/CreateAccount";
import { MyContext } from "../providers/postProvider";

const Login: React.FC = () => {
  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();
  const {
    posts,
    myPosts,
    setPosts,
    setMyPosts,
    updatePost,
    getAllPosts,
    myInfo,
  } = useContext(MyContext);
  const history = useHistory();
  const [loginToggle, setLoginToggle] = useState<boolean>(true);


  // useEffect(() => {
  //   if (user?.session.accessToken) {
  //     console.log('logged in')
  //   } else {
  //     getUser()
  //   }
  // }, [user])


  const handleLogout = async () => {
    console.log('hitting logout in login')
    try {
      const { error } = await supabase.auth.signOut();
      localStorage.removeItem("user");
      history.push("/tab1");
      console.log("You Logged Out");
      if (error) {
        console.log("this is logout error", error);
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <>
      <IonPage id="main-content">
        <div className="brown" style={{ height: '150px' }}>
          <div className="leftMiddle">
            <div style={{
              borderRadius: '10px', backgroundColor: 'white', width: '45px', display: 'flex', justifyContent: 'center',
              alignItems: 'center', margin: '10px',
            }}>
              <IonMenuButton style={{ backgroundColor: 'white' }} color={'primary'} />
            </div>
            <div className="logoContainer" style={{ top: '90px' }}>
              <div
                style={{
                  borderRadius: '50%', 
                  overflow: 'hidden', 
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <IonImg
                  style={{ width: '100%', height: '100%' }} 
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
