import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user,setUser] = useState("");

    const storeTokenInLs = (serverToken) => {
        setToken(serverToken);
        return localStorage.setItem("token", serverToken);
    }

    let isLoggedIn = !!token;

    const LogoutUser = () => {
        setToken("");
        return localStorage.removeItem("token");
    }

    const fetchAuthenticatedUser = async () => {
        try {   
            console.log("token from frontend : ", token);
            
            const response = await fetch(`http://localhost:5000/customer/user`, {
                method : "GET",
                headers : {
                    Authorization : `Bearer ${token}`,
                },
            });

            if(response.ok){
                const data = await response.json();
                console.log(data);
                setUser(data.userData);
            }
        } catch (error) {
            console.log("error fetching current user data");
            
        }
    }

    useEffect(() => {
        fetchAuthenticatedUser();
    })

    return(
        <AuthContext.Provider value={{ isLoggedIn, storeTokenInLs, LogoutUser, user}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const authContextValue = useContext(AuthContext);
    if(!authContextValue){
        throw new Error("useAuth used outside of the provider");
    }
    return authContextValue;
}