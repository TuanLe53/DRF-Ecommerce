import {
    Stack,
    Text,
    Box,
    Heading,
    Wrap,
    WrapItem,
    Tag,
    TagLabel,
    TagRightIcon,
    Image,
    Center,
    NumberInput,
    NumberInputField,
    NumberIncrementStepper,
    NumberDecrementStepper,
    NumberInputStepper,
    Button,
    FormControl,
    useToast,
    FormErrorMessage,
    Flex
} from "@chakra-ui/react";
import { TagFilled } from "@ant-design/icons";
import Slider from "react-slick";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { VNDDong } from "../utils/priceUtils";
import { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";

export default function Product() {
    const { accessToken, user } = useContext(AuthContext);
    const { product_id } = useParams();

    const toast = useToast();

    const [quantity, setQuantity] = useState(0);

    const { isPending:AddPending, mutate:AddToCart } = useMutation({
        mutationFn: async () => {
            let formData = {
                quantity: quantity,
                product: product.id
            }

            const res = await fetch("http://127.0.0.1:8000/customer/cart/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${String(accessToken)}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            const data = await res.json();
            if (res.status !== 201) throw data;

            return data
        },
        onSuccess: () => {
            setQuantity(0)
            toast({
                title: 'Success',
                description: "Added to cart",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.error,
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    })

    const isQuantityValid = quantity < 1;
    const handleClick = async (e) => {
        e.preventDefault()
        if (isQuantityValid) return;
        AddToCart()
    }

    const fetchProduct = async () => {
        let res = await fetch(`http://127.0.0.1:8000/products/${product_id}`)
        let data = await res.json()

        return data
    }

    const { isPending, error, data:product } = useQuery({
        queryKey: ["product"],
        queryFn: fetchProduct,
    });

    if (isPending) return "Loading";
    if (error) return "An error has occurred";

    return (
        <Stack direction={"row"} spacing={"50px"}>
            <Center w="50%" py={"20px"}>
                <div style={{width: "80%"}}>
                    <Slider dots={true} infinite={true} speed={500} slidesToShow={1} slidesToScroll={1}>
                        {product.images.map((item, i) => (
                            <div key={i}>
                                <Image src={item.image} objectFit={"contain"} boxSize={"500px"}/>
                            </div>
                        ))}
                    </Slider>
                </div>
            </Center>

            <Box w="50%" bg="teal" p={"10px"} borderRadius={"14px"}>
                <Heading>{product.name}</Heading>
                <Text>{VNDDong.format(product.price)}</Text>
                <Text>In stock: {product.quantity}</Text>
                <Wrap>
                    <WrapItem>Tags:</WrapItem>
                    {product.categories.map((tag, i) => (
                        <WrapItem key={i}>
                            <Tag borderRadius={"14px"}>
                                <TagLabel>{tag}</TagLabel>
                                <TagRightIcon as={TagFilled} />
                            </Tag>
                        </WrapItem>
                    ))}
                </Wrap>
                <Text mb={"5px"}>Description: {product.description}</Text>

                {user === null ?
                    <Text>You need to login to continue shopping.</Text>
                    :
                    <form onSubmit={handleClick}>
                        <Flex>
                            <FormControl isRequired isInvalid={isQuantityValid} mr={"5px"}>
                                <NumberInput value={quantity} min={1} max={product.quantity} onChange={(value) => setQuantity(value)}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                {isQuantityValid &&
                                    <FormErrorMessage>Quantity need to bigger than 0</FormErrorMessage>
                                }
                            </FormControl>
                            <Button isLoading={AddPending} type="submit">Add to cart</Button>
                        </Flex>
                    </form>
            }
            </Box>
        </Stack>
    )
}