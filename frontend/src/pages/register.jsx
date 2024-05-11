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
    InputLeftElement,
    useToast,
    useSteps,
    Stepper,
    Step,
    StepIndicator,
    StepStatus,
    StepIcon,
    StepNumber,
    StepTitle,
    StepDescription,
    StepSeparator
} from "@chakra-ui/react";
import { ArrowForwardIcon, PhoneIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const steps = [
    { title: "User", description: "User information" },
    {title: "Profile", description: "Profile information"}
]

export default function Register() {
    const [profileData, setProfileData] = useState({});
    const [userData, setUserData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        user_type: "",
    });

    const { activeStep, goToNext, goToPrevious } = useSteps({
        index: 0,
        count: steps.length
    })

    const toast = useToast();
    const navigate = useNavigate();

    const url = userData.user_type === "VENDOR" ? "vendor" : "customer"
    const registerUser = async () => {
        formData.user = userData;
        const res = await fetch(`http://127.0.0.1:8000/${url}/new/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (!res.ok) throw data;

        return data
    }

    const { isPending, mutate:DoRegister} = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            navigate("/login")
        },
        onError: (error) => {
            for (let key of Object.keys(error)) {
                if (key === "user") {
                    toast({
                        title: 'Error',
                        description: error["user"]["email"],
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    })
                    continue;
                }
                toast({
                    title: 'Error',
                    description: error[key][0],
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            }
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        // DoRegister();
        alert("CALL")
    }

    return (
        <Box p={2} w={"50%"} mt={"25%"}>
            <Text fontSize="3xl" textAlign={"center"}>Register</Text>
            <Stepper index={activeStep}>
                {steps.map((step, index) => (
                    <Step key={index}>
                        <StepIndicator>
                            <StepStatus
                                complete={<StepIcon />}
                                incomplete={<StepNumber />}
                                active={<StepNumber />}
                            />
                        </StepIndicator>
                        <Box>
                            <StepTitle>{step.title}</StepTitle>
                            <StepDescription>{step.description}</StepDescription>
                        </Box>
                        <StepSeparator />
                    </Step>
                ))}
            </Stepper>

            {activeStep === 0 &&
                <UserForm userData={userData} setUserData={setUserData} goToNext={goToNext}/>
            }
            {activeStep === steps.length - 1 &&
                <form onSubmit={handleSubmit}>                
                    <ProfileForm userData={userData} profileData={profileData} setProfileData={setProfileData} />
                    <Flex mt={"5px"}>
                        <Button
                            borderRadius={0}
                            w={"50%"}
                            variant={"outline"}
                            onClick={goToPrevious}
                        >
                            Back
                        </Button>
                        <Button
                            borderRadius={0}
                            w={"50%"}
                            bg={"tomato"}
                            isLoading={isPending}
                            type="submit"
                        >
                            Register
                        </Button>
                    </Flex>
                </form>
            }
        </Box>
    )
}

function UserForm({userData, setUserData, goToNext}) {
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        goToNext()
    }

    return (
        <form onSubmit={handleSubmit}>
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input name="email" value={userData.email} onChange={handleChange} type="email" placeholder="Enter your email"/>
            </FormControl>

            <HStack>
                <FormControl isRequired>
                    <FormLabel>First name</FormLabel>
                    <Input name="first_name" value={userData.first_name} onChange={handleChange} type="text" placeholder="Enter your first name"/>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Last name</FormLabel>
                    <Input name="last_name" value={userData.last_name} onChange={handleChange} type="text" placeholder="Enter your last name"/>
                </FormControl>
            </HStack>

            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        name="password"
                        onChange={handleChange}
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

            <FormControl isRequired>
                <FormLabel>Role</FormLabel>
                <Select
                    name="user_type"
                    value={userData.user_type}
                    onChange={handleChange}
                    placeholder="Select your role"
                >
                    <option value="CUSTOMER">Customer</option>
                    <option value="VENDOR">Vendor</option>
                </Select>
            </FormControl>
            <Button
                type="submit"
                float={"right"}
                mt={"5px"}
                rightIcon={<ArrowForwardIcon />}
            >
                Next
            </Button>
        </form>
    )
}

function ProfileForm({userData, setProfileData, profileData }) {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value
        })
    }

    if (userData.user_type) return (
        <>
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
    )
}