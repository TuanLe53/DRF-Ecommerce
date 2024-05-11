import {
    Container,
    Flex,
    Spacer,
    Center,
    HStack,
    Button,
    IconButton,
    Heading
} from "@chakra-ui/react";
import { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { UserOutlined, ShoppingCartOutlined, LogoutOutlined } from "@ant-design/icons";
import AuthContext from "../../contexts/AuthContext";

export default function MainLayout() {
    const { user, logoutUser } = useContext(AuthContext);

    const navigate = useNavigate();

    return (
        <>
            <Center bg="teal" py={"5px"}>
                <Flex w={"80%"}>
                    <Link to={"/"}>
                        <Heading>Ecommerce</Heading>
                    </Link>
                    <Spacer />
                    {user === null ?                        
                        <HStack>
                            <Button><Link to={"/login"}>Login</Link></Button>
                            <Button><Link to={"/register"}>Register</Link></Button>
                        </HStack>
                    :
                        <HStack>
                            <IconButton
                                aria-label="Shopping cart"
                                icon={<ShoppingCartOutlined />}
                                borderRadius={"50%"}
                            />
                            <IconButton
                                aria-label="User profile"
                                icon={<UserOutlined />}
                                borderRadius={"50%"}
                                onClick={() => navigate("/profile")}
                            />
                            <IconButton
                                aria-label="Logout"
                                icon={<LogoutOutlined />}
                                borderRadius={"50%"}
                                onClick={logoutUser}
                            />
                        </HStack>
                }
                </Flex>
            </Center>
            <Container maxW={"80%"} minH={"100vh"} py={5} bg="tomato">
                <Outlet />
            </Container>
        </>
    )
}