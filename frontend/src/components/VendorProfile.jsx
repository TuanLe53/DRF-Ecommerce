import { ShopOutlined, ShoppingOutlined } from "@ant-design/icons";
import {
    Button,
    Icon,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    useDisclosure,
    useToast,
    Box,
    Wrap,
    WrapItem,
    Card,
    CardBody,
    Stack,
    Heading,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    Text,
    Image,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    FormErrorMessage,
    ModalFooter
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import CategorySelector from "./CategorySelector";
import { useState, useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { AddIcon, InfoIcon, DeleteIcon, CloseIcon } from "@chakra-ui/icons";
import { useNavigate, Link } from "react-router-dom";
import { VNDDong } from "../utils/VNDDongFormat";
import { EllipsisOutlined } from "@ant-design/icons";

export default function VendorProfile() {
    
    return (        
        <Tabs isLazy isFitted variant={"enclosed"} size={"lg"}>
            <TabList>
                <Tab><Icon as={ShopOutlined} /> Products</Tab>
                <Tab><Icon as={ShoppingOutlined} /> Orders</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <ProductTab />
                </TabPanel>
                <TabPanel><p>Orders</p></TabPanel>
            </TabPanels>
        </Tabs>
    )
}

function ProductTab() {
    const { accessToken } = useContext(AuthContext);
    const navigate = useNavigate();
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
            <Button onClick={onOpen} leftIcon={<AddIcon />}>Add</Button>
            <Box>
                {data.length === 0 ?
                    <Text>You have zero products</Text>
                    :
                    <Wrap>
                        {data.map((product, i) => (
                            <WrapItem pos="relative" key={i}>
                                <Link to={`/product/${product.slug}`}>
                                    <Card>
                                        <CardBody>
                                            <Image
                                                src={product.images[0]["image"]}
                                                objectFit={"contain"}
                                                boxSize={"125px"}
                                            />
                                            <Stack>
                                                <Heading size={"md"}>{product.name}</Heading>
                                                <Text>{VNDDong.format(product.price)}</Text>
                                            </Stack>
                                        </CardBody>
                                    </Card>
                                </Link>
                                <Menu>
                                    <MenuButton
                                        as={IconButton}
                                        icon={<Icon as={EllipsisOutlined} />}
                                        borderRadius={"50%"}
                                        pos={"absolute"}
                                        top={1}
                                        right={1}
                                        size={"xs"}
                                    />
                                    <MenuList>
                                        <MenuItem icon={<InfoIcon />} onClick={() => navigate(`/product/detail/${product.id}`)}>Detail</MenuItem>
                                        <MenuItem icon={<DeleteIcon />}>Delete</MenuItem>
                                    </MenuList>
                                </Menu>
                            </WrapItem>
                        ))}
                    </Wrap>
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

    const addCategory = (e) => {
        if (!formData.categories.includes(e.target.value)) {
            setFormData((prevState) => ({
                ...prevState,
                categories: [...prevState.categories, e.target.value]
            }))
        }
    };

    const removeCategory = (e) => {
        let newCategories = formData.categories.filter((category) => category !== e.currentTarget.value)
        setFormData((prevState) => ({
            ...prevState,
            categories: newCategories
        }))
    }

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
                    <CategorySelector selectedCategories={formData.categories} addCategory={addCategory} removeCategory={removeCategory}/>
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
                        <WrapItem key={i} pos="relative" bg={"gray"}>
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