import { useContext, useState } from "react"
import AuthContext from "../contexts/AuthContext"
import {
    Avatar,
    Box,
    Button,
    Center,
    Container,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Heading,
    Image,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Spacer,
    Tag,
    TagCloseButton,
    TagLabel,
    Text,
    Textarea,
    Wrap,
    WrapItem,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query"; 
import { EmailIcon, PhoneIcon, AddIcon, CloseIcon } from "@chakra-ui/icons";

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
    
    if (isPending) return 'Loading...'
    if (error) return 'An error has occurred'

    return (
        <Container maxW={"80%"} height={"100vh"} pt={5} bg="tomato">
            <HStack spacing={"40px"}>
                <Box w="30%" bg="cyan">
                    <Center>
                        <Avatar size={"2xl"} src={data.avatar} />
                    </Center>
                    <Center>
                        <Text>{data.shop_name}</Text>
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
                    <Text>{data.description}</Text>
                    <Box>
                        Orders
                    </Box>

                    <ProductSection />
                    
                </Box>
            </HStack>
        </Container>
    )
}

function ProductSection() {
    const { accessToken } = useContext(AuthContext);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const fetchProducts = async () => {
        let res = await fetch("http://127.0.0.1:8000/products/vendor/", {
            headers: {"Authorization": `Bearer ${String(accessToken)}`} 
        })
        let data = await res.json()

        return data
    }

    const {isPending, error, data} = useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
    })
    
    if (isPending) return 'Loading...'
    if (error) return 'An error has occurred'

    return (
        <Box>
            <Flex>
                <Heading as={"h2"} size={"xl"}>
                    Products
                </Heading>
                <Spacer />
                <Button onClick={onOpen} leftIcon={<AddIcon />}>
                    Add
                </Button>
            </Flex>
            <Box>
                {data.length === 0 &&
                    <Text>You have zero products</Text>
                }
            </Box>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <AddProductModal onClose={onClose}/>
                </ModalContent>
            </Modal>

        </Box>
    )
}

function AddProductModal({ onClose }) {
    const { accessToken } = useContext(AuthContext);

    const toast = useToast();

    const [formData, setFormData] = useState({
        "name": "",
        "sku": "",
        "description": "",
        "price": 0,
        "quantity": 0,
        "categories": [],
    });

    const [pdImages, setPdImages] = useState(null);
    const previewImages = pdImages ? [...pdImages] : [];
    const isImagesEmpty = previewImages.length === 0;

    const removeImage = (image) => {
        setPdImages(previewImages.filter((item) => item.name !== image.name))
    }

    const handleChange = (e) => {
        let { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        })
    }
    const handleFileChange = (e) => {
        setPdImages(e.target.files);
    };

    const isCategoryValid = formData.categories.length === 0;

    const createProduct = async (e) => {
        let body = new FormData();
        for (const key in formData) {
            body.append(key, formData[key])
        }

        previewImages.forEach((image) => {
            body.append("images", image)
        })

        let res = await fetch("http://127.0.0.1:8000/products/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${String(accessToken)}`
            },
            body: body
        })

        let data = await res.json();
        if (res.status !== 201) throw data;

        return data
    }

    const { isPending, mutate: CreateProduct } = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            onClose()
            toast({
                title: 'Product created.',
                description: "We've added the product to your vendor.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: "Something went wrong. Please try again later",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    })

    const submitForm = (e) => {
        e.preventDefault()
        if (isCategoryValid) return;
        if (isImagesEmpty) return;
        CreateProduct();
    }

    return (
        <form onSubmit={submitForm}>
            <ModalHeader>Add Product</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input name="name" onChange={handleChange} type="text" placeholder="Enter your product name" />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Sku</FormLabel>
                    <Input name="sku" onChange={handleChange} type="text" placeholder="Enter your product sku" />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Description</FormLabel>
                    <Textarea name="description" onChange={handleChange} type="text" placeholder="Enter your product description" />
                </FormControl>
                
                <FormControl isRequired>
                    <FormLabel>Price</FormLabel>
                    <NumberInput min={1000} step={1000} onChange={(value) => setFormData({...formData, "price": value})}>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Quantity</FormLabel>
                    <NumberInput min={1} onChange={(value) => setFormData({...formData, "quantity": value})}>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </FormControl>

                <FormControl isRequired isInvalid={isCategoryValid}>
                    <FormLabel>Categories</FormLabel>
                    <CategoriesSelect formData={formData} setFormData={setFormData} />
                    {isCategoryValid &&
                        <FormErrorMessage>Your product needs at least one category.</FormErrorMessage>
                    }
                </FormControl>

                <FormControl isRequired isInvalid={isImagesEmpty}>
                    <FormLabel>Images</FormLabel>
                    <Input name="pdImages" type="file" accept="image/*" multiple onChange={handleFileChange} />
                    {isImagesEmpty &&
                        <FormErrorMessage>Your products needs at least one image.</FormErrorMessage>
                    }
                </FormControl>

                <Wrap>
                    {previewImages.map((image, i) => (
                        <WrapItem key={i} pos="relative" bg={"teal"}>
                            <Image
                                src={URL.createObjectURL(image)}
                                objectFit="contain"
                                boxSize={"100px"}
                            />
                            <Button
                                borderRadius={"50%"}
                                pos="absolute"
                                right={1}
                                top={1}
                                size={"10px"}
                                p={"2px"}
                                onClick={() => removeImage(image)}
                            >
                                <CloseIcon boxSize={"10px"}/>
                            </Button>
                        </WrapItem>
                    ))}
                </Wrap>

            </ModalBody>

            <ModalFooter>
                <Button colorScheme="blue" onClick={onClose}>Close</Button>
                <Button isLoading={isPending} type="submit" variant='ghost'>Secondary Action</Button>
            </ModalFooter>

        </form>
    )
}

function CategoriesSelect({formData, setFormData}) {
    const categories = ["shirt", "t-shirt", "pant", "sneaker"];

    const addCategory = (e) => {
        if (!formData.categories.includes(e.target.value)) {            
            setFormData((prevState) => ({
                ...prevState,
                categories: [...prevState.categories, e.target.value]
            }))
        };
    }

    const removeCategory = (e) => {
        let newCategories = formData.categories.filter((category) => category !== e.currentTarget.value)
        setFormData((prevState) => ({
            ...prevState,
            categories: newCategories
        }))
    }

    return (
        <Wrap align="center">
            {formData.categories.map((category, i) => (
                <WrapItem key={i}>
                    <Tag>
                        <TagLabel>{category}</TagLabel>
                        <TagCloseButton value={category} onClick={removeCategory}/>
                    </Tag>
                </WrapItem>
            ))}
            <WrapItem>
                <Menu>
                    <MenuButton as={Button} leftIcon={<AddIcon />}>Categories</MenuButton>
                    <MenuList>
                        {categories.map((category, i) => (
                            <MenuItem key={i} value={category} onClick={addCategory}>{category}</MenuItem>
                        ))}
                    </MenuList>
                </Menu>
            </WrapItem>
        </Wrap>
    )
}