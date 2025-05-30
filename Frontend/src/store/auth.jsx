import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState("");
    const [isAdmin, setIsAdmin] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const storeTokenInLs = (serverToken) => {
        setToken(serverToken);
        return localStorage.setItem("token", serverToken);
    }

    let isLoggedIn = !!token;

    const LogoutUser = () => {
        setToken("");
        setUser("");
        return localStorage.removeItem("token");
    }

    const fetchAuthenticatedUser = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:5000/customer/user`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const res_data = await response.json();
            if (response.ok) {
                console.log(res_data.data.userData);
                setUser(res_data.data.userData);
                setIsLoading(false);
            }
            else{
                console.log(res_data);                
                setIsLoading(false);
            }
        } catch (error) {
            console.log("error fetching current user data", error);

        }
    }

    useEffect(() => {
        if (token) {
            fetchAuthenticatedUser();
        }
    }, [token]);


    useEffect(() => {
        if (user && user.is_admin === true) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, storeTokenInLs, LogoutUser, user, isAdmin, isLoading, token }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const authContextValue = useContext(AuthContext);
    if (!authContextValue) {
        throw new Error("useAuth used outside of the provider");
    }
    return authContextValue;
}