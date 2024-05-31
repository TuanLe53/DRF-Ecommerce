import { Box, Button, Heading, ListItem, Select, Stack, Text, UnorderedList, useToast } from "@chakra-ui/react";
import CartItem from "../components/CartItem";
import { useBoundStore } from "../store/store"
import { totalPrice } from "../utils/priceUtils";
import { useContext, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import AuthContext from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function PlaceOrder() {
    const cartItems = useBoundStore(store => store.cartItems);
    const { accessToken } = useContext(AuthContext);
    const toast = useToast();
    const navigate = useNavigate();

    let products = [];
    cartItems.map((item) => products.push({
        "product_id": item.product.id,
        "quantity": item.quantity
    }))

    const [formData, setFormData] = useState({
        products: products,
        payment_type: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const {isPending, mutate:CreateOrder} = useMutation({
        mutationFn: async () => {
            const res = await fetch("http://127.0.0.1:8000/order/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${String(accessToken)}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            let data = await res.json()
            if (res.status !== 201) throw data
            
            return data;
        },
        onSuccess: () => {
            toast({
                title: 'Success',
                description: "Order created",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
            navigate("/profile")
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: "Something went wrong. Please try again later.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        CreateOrder()
    } 

    return (
        <Stack direction={"row"}>
            <Box bg={"paleturquoise"} w={"40%"} p={"10px"} borderRadius={"14px"}>
                <Heading mb={"5px"}>Cart</Heading>
                {cartItems.map((item, i) => (
                    <CartItem key={i} item={item}/>
                ))}
            </Box>
            <Box bg={"teal"} w={"30%"} p={"10px"} borderRadius={"14px"}>
                <form onSubmit={handleSubmit}>
                    <Heading size={"lg"} mb={"10px"}>Select your payment method</Heading>
                    <Select
                        name="payment_type"
                        onChange={handleChange}
                        placeholder="Choose your payment method"
                        isRequired
                        mb={"10px"}
                    >
                        <option value="COD">COD</option>
                        <option value="CREDIT_CARD">CREDIT</option>
                    </Select>
                    {formData.payment_type === "CREDIT_CARD" && <PaymentSelector handleChange={handleChange} />}
                    <Text textAlign={"right"}>Total: {totalPrice(cartItems)}</Text>
                    <Button
                        type="submit"
                        isLoading={isPending}
                        float={"right"}
                        my={"10px"}
                    >
                        Order
                    </Button>
                </form>
            </Box>
            <Box bg={"red"} w={"30%"} p={"10px"} borderRadius={"14px"}>
                <Heading>Policies</Heading>
                <UnorderedList>
                    <ListItem>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis cum repudiandae suscipit reprehenderit repellendus incidunt libero voluptatibus impedit consectetur, aperiam aut dolore veniam illo et dolores deserunt nemo vitae eligendi.</ListItem>
                    <ListItem>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam blanditiis corporis cumque nihil asperiores maiores saepe fugit accusamus! Porro ratione laudantium incidunt molestiae a voluptatum ipsa quaerat qui sequi rem.</ListItem>
                    <ListItem>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam blanditiis corporis cumque nihil asperiores maiores saepe fugit accusamus! Porro ratione laudantium incidunt molestiae a voluptatum ipsa quaerat qui sequi rem.</ListItem>
                    <ListItem>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam blanditiis corporis cumque nihil asperiores maiores saepe fugit accusamus! Porro ratione laudantium incidunt molestiae a voluptatum ipsa quaerat qui sequi rem.</ListItem>
                </UnorderedList>
            </Box>
        </Stack>
    )
}

function PaymentSelector({handleChange}) {
    const { accessToken } = useContext(AuthContext);

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
        <Select
            placeholder="Choose your payment"
            name="payment"
            onChange={handleChange}
            mb={"10px"}
            isRequired
        >
            {payments.map((payment, i) => (
                <option value={payment.id} key={i}>{payment.account_number}</option>
            ))}
        </Select>
    )
}