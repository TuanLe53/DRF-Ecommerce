import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();
export default AuthContext;

export function AuthProvider({children}) {
    let [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken") ? JSON.parse(localStorage.getItem("accessToken")) : null);
    let [user, setUser] = useState(() => localStorage.getItem("accessToken") ? jwtDecode(localStorage.getItem("accessToken")) : null);
    let [loading, setLoading] = useState(true);

    const logoutUser = () => {
        setAccessToken(null)
        setUser(null)
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
    }

    const updateToken = async () => {

        let res = await fetch("http://127.0.0.1:8000/user/refresh/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "refresh": JSON.parse(localStorage.getItem("refreshToken"))
             })
        })
        
        let data = await res.json();

        if (res.status === 200) {
            setAccessToken(data.access)
            setUser(jwtDecode(data.access))
            localStorage.setItem("accessToken", JSON.stringify(data.access))
            localStorage.setItem("refreshToken", JSON.stringify(data.refresh))
        } else {
            logoutUser()
        }

        if(loading){
            setLoading(false)
        }
    }

    let contextData = {
        user,
        setUser,
        accessToken,
        setAccessToken,
        logoutUser,
    }

    useEffect(() => {
        if (loading) {
            updateToken()
        }

        let fourMinutes = 1000 * 60 * 4;

        let interval = setInterval(() => {
            if (accessToken) {
                updateToken()
            }
        }, fourMinutes)

        return () => clearInterval(interval);
    }, [accessToken, loading])

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}