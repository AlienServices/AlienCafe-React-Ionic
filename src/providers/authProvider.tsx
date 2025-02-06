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
import { Preferences } from "@capacitor/preferences";
import { useHistory } from "react-router";

// Define AuthContext type
interface AuthContextType {
    loggedIn: boolean;
    // validateJsonToken: (token: string) => Promise<boolean>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
    loggedIn: false,
    // validateJsonToken: async () => false,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { loggedIn, setLoggedIn } = useContext(UserContext);
    const { getBaseUrl } = useContext(MyContext);
    const { myInfo } = useContext(UserContext);
    const history = useHistory();


    useEffect(() => {
        const validateToken = async () => {
            const { data, error } = await supabase.auth.getSession();            
            if (data) {
                localStorage.setItem("user", data?.session?.user.email);                
                history.push('/tab1')
            } else {
                console.log('hitting false on validate token')
                setLoggedIn(false)
                history.push('/login')
            }
        };
        validateToken();
    }, []);



    const validateJsonToken = async (token: string) => {
        try {
            console.log(token, 'hitting validate json token')
            const { data, error } = await supabase.auth.signInWithIdToken({
                provider: "email",
                token,
            });

        } catch (error) {
            console.error("Token validation error:", error);
            history.push('/login')
        }
    };

    return (
        <AuthContext.Provider value={{ loggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };
