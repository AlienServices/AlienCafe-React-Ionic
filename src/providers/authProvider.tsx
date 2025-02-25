import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
} from "react";
import { supabase } from "../components/supaBase";
import { UserContext } from "./userProvider";
import { MyContext } from "./postProvider";
import { useHistory } from "react-router";

interface AuthContextType {
  loggedIn: boolean;
}

const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { loggedIn, setLoggedIn } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    const validateSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        localStorage.setItem("user", data.session.user.email || "");
        setLoggedIn(true);
        history.push("/tab1");
      } else {
        setLoggedIn(false);
        history.push("/login");
      }
    };

    validateSession();
  }, [setLoggedIn, history]);

  return (
    <AuthContext.Provider value={{ loggedIn }}>{children}</AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };