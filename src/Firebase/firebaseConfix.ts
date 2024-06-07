import { initializeApp } from "firebase/app";
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBBSnSX1bWxualXT7WLqvPPgJotcAHhZT4",
  authDomain: "messaging-dab8f.firebaseapp.com",
  projectId: "messaging-dab8f",  
  messagingSenderId: "113054694117",
  appId: "1:113054694117:ios:d454b279f47f353e25720c"
};

const app = initializeApp(firebaseConfig);

export default app;