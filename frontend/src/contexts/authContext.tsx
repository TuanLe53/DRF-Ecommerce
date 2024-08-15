import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { User } from "@/types/user";

export interface ContextProps{
    authState: AuthState;
    user: User;
    updateAuthState: (token: string) => void;
    logout: () => void;
}

export interface AuthState{
    authToken: string | null;
    isAuth: boolean;
}

interface AuthProviderProps{
    children: ReactNode;
}

const initialState = {
    authState: {
        authToken: null,
        isAuth: false
    },
    user: {
        username: null,
        id: null,
        type: null
    },
    updateAuthState: (token: string)=>{},
    logout: ()=>{},
}

const AuthContext = createContext<ContextProps>(initialState);
export default AuthContext;

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [authState, setAuthState] = useState<AuthState>({
        authToken: null,
        isAuth: false
    });

    const [user, setUser] = useState<User>({
        username: null,
        id: null,
        type: null
    });

    const [loading, setLoading] = useState<boolean>(true);

    const getTokens = () => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            updateAuthState(accessToken)
        }
    }

    const updateAuthState = (token: string) => {
        localStorage.setItem('accessToken', token)
        setAuthState({
            authToken: token,
            isAuth: true
        })
        const decoded = jwtDecode<User>(token);
        setUser({
            username: decoded.username,
            id: decoded.id,
            type: decoded.type
        })
    }

    const logout = async () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAuthState({
            authToken: null,
            isAuth: false
        })
        setUser({
            username: null,
            id: null,
            type: null
        })
    }

    const updateToken = async () => {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {            
            const res = await fetch('http://127.0.0.1:8000/user/refresh/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: refreshToken })
            });
    
            const data = await res.json();
    
            if (res.status === 200) {
                localStorage.setItem('accessToken', data.access)
                localStorage.setItem('refreshToken', data.refresh)
                updateAuthState(data.access)
            } else {
                logout()
            }
        }
        if (loading) setLoading(false);
    }

    const contextData = {
        authState,
        user,
        logout,
        updateAuthState
    }

    useEffect(() => {
        getTokens()

        if (loading) {
            updateToken()
        }

        const fourMinutes = 1000 * 60 * 4;
        const interval = setInterval(() => {
            if (authState.authToken) {
                updateToken()
            }
        }, fourMinutes)

        return () => clearInterval(interval)
    }, [authState.authToken, loading])

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);