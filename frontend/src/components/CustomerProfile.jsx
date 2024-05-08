import { ShoppingCartOutlined, ShoppingOutlined } from "@ant-design/icons";
import { AddIcon, Icon } from "@chakra-ui/icons";
import {
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Card,
    Select,
    Text,
    IconButton,
    Box,
    useDisclosure,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useToast,
    Center,
    VStack,
    FormControl,
    FormLabel,
    Input,
    FormHelperText,
    CardHeader,
    CardBody,
    Heading
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import {VNDDong} from "../utils/VNDDongFormat"
import { useBoundStore } from "../store/store";
import CartItem from "./CartItem";

export default function CustomerProfile() {

    return (
        <Tabs isLazy isFitted variant={"enclosed"} size={"lg"}>
            <TabList>
                <Tab><Icon as={ShoppingCartOutlined} /> Cart</Tab>
                <Tab>Payments</Tab>
                <Tab><Icon as={ShoppingOutlined} />Orders</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <CartTab />
                </TabPanel>
                <TabPanel>
                    <PaymentTab />
                </TabPanel>
                <TabPanel>
                    <OrderTab />
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

function CartTab() {
    const { accessToken } = useContext(AuthContext);

    const navigate = useNavigate();

    const cartItems = useBoundStore((state) => state.cartItems);
    const setCartItems = useBoundStore((store) => store.setCartItems);

    const fetchCartItems = async () => {
        let res = await fetch("http://127.0.0.1:8000/customer/cart/", {
            headers: {"Authorization": `Bearer ${String(accessToken)}`} 
        })

        let data = await res.json()
        setCartItems(data)
        return data
    }

    const {isPending, error} = useQuery({
        queryKey: ["cartItems"],
        queryFn: fetchCartItems,
    })

    if (isPending) return "Loading";
    if (error) return "An error has occurred";

    const totalEstimate = () => {
        let total = 0;

        for (let i = 0; i < cartItems.length; i++){
            total += cartItems[i].quantity * cartItems[i].product.price
        }
        
        return total
    }

    return (
        <>
            {cartItems.map((item, i) => (
                <CartItem key={i} item={item}/>
            ))}
            <Text textAlign={"right"}>Total: {VNDDong.format(totalEstimate())}</Text>
            <Button isDisabled={cartItems.length === 0} onClick={() => navigate("/orders/new")} float={"right"}>Place Order</Button>
        </>
    )
}

function PaymentTab() {
    const { accessToken } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        provider: "",
        account_number: "",
        expiry_date: ""
    })
    
    const {isOpen, onOpen, onClose} = useDisclosure();
    const toast = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }
    
    const {isPending:AddPending, mutate:CreatePayment } = useMutation({
        mutationFn: async () => {
            const res = await fetch("http://127.0.0.1:8000/payments/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${String(accessToken)}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            
            let data = await res.json();
            if (res.status !== 201) throw data;
            
            return data
        },
        onSuccess: () => {
            onClose()
            toast({
                title: 'Success',
                description: "Payment added",
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
    
    const handleSubmit = (e) => {
        e.preventDefault()
        CreatePayment()
    }
    
    const fetchPayments = async () => {
        const res = await fetch("http://127.0.0.1:8000/payments/", {
            headers: {"Authorization": `Bearer ${String(accessToken)}`}
        })
        const data = await res.json();

        return data
    }

    const { isPending, error, data:payments} = useQuery({
        queryKey: ["payments"],
        queryFn: fetchPayments
    })
    
    if (isPending) return "Loading";
    if (error) return "An error has occurred";

    return (
        <>
            {payments.length === 0 ?
                <Center>
                    <VStack>
                        <Text>You have no payments.</Text>
                        <IconButton aria-label="Open create payment model" icon={<AddIcon />} onClick={onOpen}/>
                    </VStack>
                </Center>
                :
                <Box>
                    {payments.map((payment, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Heading>{payment.id}</Heading>
                            </CardHeader>
                            <CardBody>
                                <Text>Account number: {payment.account_number}</Text>
                                <Text>Expiry date: {payment.expiry_date}</Text>
                                <Text>Provider: {payment.provider}</Text>
                                {payment.is_default && <Text color="green">DEFAULT</Text>}
                            </CardBody>
                        </Card>
                    ))}
                    <IconButton float="right" aria-label="Open create payment model" icon={<AddIcon />} onClick={onOpen}/>
                </Box>
            }
            
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Payment</ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={handleSubmit}>
                        <ModalBody>
                            <FormControl isRequired>
                                <FormLabel>Account number</FormLabel>
                                <Input name="account_number" onChange={handleChange}/>
                                <FormHelperText>We'll never share your information.</FormHelperText>
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Provider</FormLabel>
                                <Select name="provider" onChange={handleChange} placeholder="Select provider">
                                    <option value="MASTERCARD">Mastercard</option>
                                    <option value="VISA">Visa</option>
                                </Select>
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Expiry date</FormLabel>
                                <Input type="date" name="expiry_date" onChange={handleChange} />
                            </FormControl>
                        </ModalBody>
                        
                        <ModalFooter>
                            <Button onClick={onClose}>Close</Button>
                            <Button isLoading={AddPending} type="submit">Add</Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}

function OrderTab() {
    const { accessToken } = useContext(AuthContext);

    const fetchOrders = async () => {
        const res = await fetch("http://127.0.0.1:8000/order/", {
            headers: {"Authorization": `Bearer ${String(accessToken)}`,},
        })
        const data = await res.json()
        if (res.status !== 200) throw data;

        return data
    }

    const { isPending, error, data} = useQuery({
        queryKey: ["orders"],
        queryFn:fetchOrders
    })

    if (data) console.log(data);
    if (error) console.log(error);

    return (
        <>
            <p>Pyament Hehehehe</p>
        </>
    )
}