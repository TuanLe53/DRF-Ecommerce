import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (user === null) {
          navigate('/login', { replace: true });
        }
    }, [navigate, user]);
    
    return children
}