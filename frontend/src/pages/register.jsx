import {
    Button,
    Select,
    Flex,
    Text,
    Box,
    FormControl,
    FormLabel,
    Input,
    HStack,
    InputGroup,
    InputRightElement,
    InputLeftElement
} from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [formData, setFormData] = useState({});
    const [userData, setUserData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        user_type: "",
    });

    const navigation = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleChangeUserData = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        })
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }
    const registerUser = async () => {
        formData.user = userData;
        const res = await fetch("http://127.0.0.1:8000/customer/new/", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (!res.ok) throw data;

        return data
    }

    const {error, isPending, isSuccess, isError, mutate:DoRegister} = useMutation({
        mutationFn: registerUser
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        DoRegister();
    }

    if (isError) console.log("Error", error);
    if (isSuccess) {
        navigation("/login")
    };

    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            height="100vh"
        >
            <Box p={2} bg="tomato">
                <Text fontSize="3xl">Register Page</Text>
                <form onSubmit={handleSubmit}>

                    <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input name="email" onChange={handleChangeUserData} type="email" placeholder="Enter your email"/>
                    </FormControl>

                    <HStack>
                        <FormControl isRequired>
                            <FormLabel>First name</FormLabel>
                            <Input name="first_name" onChange={handleChangeUserData} type="text" placeholder="Enter your first name"/>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Last name</FormLabel>
                            <Input name="last_name" onChange={handleChangeUserData} type="text" placeholder="Enter your last name"/>
                        </FormControl>
                    </HStack>

                    <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <InputGroup>
                            <Input
                                name="password"
                                onChange={handleChangeUserData}
                                placeholder="Enter your password"
                                type={showPassword ? "text" : "password"}
                            />
                            <InputRightElement>
                                <Button onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? "Hide" : "Show"}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Role</FormLabel>
                        <Select
                            name="user_type"
                            onChange={handleChangeUserData}
                            placeholder="Select your role"
                        >
                            <option value="CUSTOMER">Customer</option>
                            <option value="VENDOR">Vendor</option>
                        </Select>
                    </FormControl>

                    {userData.user_type === "VENDOR" &&
                    <>
                        <FormControl isRequired>
                            <FormLabel>Shop name</FormLabel>
                            <Input name="shop_name" onChange={handleChange} type="text" placeholder="Enter your shop name"/>
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Description</FormLabel>
                            <Input name="description" onChange={handleChange} type="text" placeholder="Enter your shop description"/>
                        </FormControl>
                    </>
                    }

                    {userData.user_type &&
                        <>                        
                            <FormControl isRequired>
                                <FormLabel>City</FormLabel>
                                <Input name="city" onChange={handleChange} type="text" placeholder="Enter your city"/>
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Address</FormLabel>
                                <Input name="address" onChange={handleChange} type="text" placeholder="Enter your address"/>
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Phone number</FormLabel>
                                <InputGroup>
                                    <InputLeftElement>
                                        <PhoneIcon />
                                    </InputLeftElement>
                                    <Input name="phone_number" onChange={handleChange} type='tel' placeholder='Phone number' />
                                </InputGroup>
                            </FormControl>
                        </>
                    }
                    
                    <Button
                        type="submit"
                        colorScheme="red"
                        isLoading={isPending}
                    >
                        Register
                    </Button>
                </form>
            </Box>
        </Flex>
    )
}