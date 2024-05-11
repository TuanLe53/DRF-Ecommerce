import { Center, Flex, Heading, Text } from "@chakra-ui/react";
import { Link, Outlet } from "react-router-dom";

export default function AuthenticationLayout() {
    
    return (
        <Flex
            height={"100vh"}
            justify={"center"}
        >
            <Flex
                direction="row"
                bg={"pink"}
                width={"50vw"}
            >
                <Center bg={"red"} flexDirection={"column"} w={"50%"}>
                    <Link to={"/"}>
                        <Heading>Ecommerce</Heading>
                    </Link>
                    <Text textAlign={"center"}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet praesentium saepe ea corporis sequi aliquam eaque esse necessitatibus accusantium quasi earum voluptatibus adipisci commodi recusandae, nam nobis cupiditate eum itaque.
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, consequatur aliquam incidunt non quisquam excepturi facilis dolores impedit? Iure qui culpa excepturi rerum unde inventore corrupti. Veritatis esse dignissimos distinctio.
                    </Text>
                </Center>
                <Outlet />
            </Flex>
        </Flex>
    )
}