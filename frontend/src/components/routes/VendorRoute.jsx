import { useContext, useEffect } from "react"
import AuthContext from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

export default function VendorRoute({ children }) {
    const { user } = useContext(AuthContext);

    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        if (user === null) {
            navigate("/", { replace: true })
            return;
        }
        if (user.user_type !== "VENDOR" || user === null) {
            navigate("/", { replace: true })
            toast({
                title: 'Permission denied.',
                description: "You have no permission to access this page",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    },[navigate, user])
    

    return children
}