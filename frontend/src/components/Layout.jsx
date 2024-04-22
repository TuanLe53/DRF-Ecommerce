import { Container } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export default function Layout() {
    
    return (
        <Container maxW={"80%"} height={"100vh"} pt={5} bg="tomato">
            <Outlet />
        </Container>
    )
}