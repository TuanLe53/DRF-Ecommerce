import { useContext } from "react"
import AuthContext from "../contexts/AuthContext"
import {
    Avatar,
    Box,
    Center,
    HStack,
    Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query"; 
import { EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import CustomerProfile from "../components/CustomerProfile";
import VendorProfile from "../components/VendorProfile";

export default function Profile() {
    const { accessToken } = useContext(AuthContext);

    const fetchProfile = async () => {
        let res = await fetch("http://127.0.0.1:8000/user/profile/", {
            headers: {"Authorization": `Bearer ${String(accessToken)}`} 
        })
        let data = await res.json()

        return data
    }

    const {isPending, error, data} = useQuery({
        queryKey: ["profileData"],
        queryFn: fetchProfile,
    })

    if (isPending) return 'Loading...';
    if (error) return 'An error has occurred';

    return (
        <HStack spacing={"40px"}>
                    <Box w="30%" bg="cyan">
                        <Center>
                            <Avatar size={"2xl"} src={data.avatar} />
                        </Center>
                        <Center>
                            <Text>{data.user.user_type === "VENDOR"? data.shop_name : `${data.user.first_name} ${data.user.last_name}`}</Text>
                        </Center>
                        <HStack>
                            <EmailIcon />
                            <Text>{data.user.email}</Text>
                        </HStack>
                        <HStack>
                            <PhoneIcon />
                            <Text>{data.phone_number}</Text>
                        </HStack>
                        <Text>{data.city}</Text>
                        <Text>{data.address}</Text>
                    </Box>
                    <Box w="70%" p={2} bg="palegreen">
                        {data.user.user_type === "CUSTOMER" ?
                            <CustomerProfile />
                        :
                            <VendorProfile />
                    }   
                    </Box>
        </HStack>
    )
}