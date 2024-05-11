import { Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Text,
    useToast
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";


export default function Login() {
    const { setAccessToken, setUser } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const toast = useToast();

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const loginUser = async () => {
        const res = await fetch("http://127.0.0.1:8000/user/login/", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })

        const data = await res.json();
        if (!res.ok) throw data;
        
        return data
    }

    const { isPending, mutate: DoLogin } = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            setAccessToken(data.access)
            setUser(jwtDecode(data.access))
            localStorage.setItem("accessToken", JSON.stringify(data.access))
            localStorage.setItem("refreshToken", JSON.stringify(data.refresh))
            navigate(-1)
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.detail,
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        DoLogin();
    }

    return (
        <Box p={2} w={"50%"} mt={"30%"}>
            <Text fontSize="3xl" textAlign={"center"}>Login</Text>

            <form onSubmit={handleSubmit}>
                
                <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input name="email" onChange={handChange} type="email" placeholder="Enter your email" />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                        <Input
                            name="password"
                            onChange={handChange}
                            placeholder="Enter your password"
                            type={showPassword ? "text" : "password"}
                        />
                        <InputRightElement w={"3.5rem"}>
                            <Button h={"2rem"} size={"sm"} onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? "Hide" : "Show"}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <Button
                    type="submit"
                    colorScheme="red"
                    isLoading={isPending}
                    w="100%"
                    mt={"10px"}
                >
                    Login
                </Button>
            </form>
            <Text textAlign={"right"}>
                <Link to={"/register"}>
                    Register
                </Link>
            </Text>
        </Box>
    )
}