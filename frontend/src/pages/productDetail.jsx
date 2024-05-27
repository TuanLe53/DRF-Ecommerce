import {
    Badge,
    Box,
    Center,
    Flex,
    Heading,
    IconButton,
    Image,
    InputGroup,
    InputRightAddon,
    NumberInput,
    NumberInputField,
    Stack,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import { AddIcon, CheckIcon, CloseIcon, DeleteIcon } from "@chakra-ui/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";

export default function ProductDetail() {
    const { slug } = useParams();

    const fetchProduct = async () => {
        let res = await fetch(`http://127.0.0.1:8000/products/${slug}`)
        let data = await res.json()

        return data
    }

    const { isPending, error, data:product } = useQuery({
        queryKey: ["product"],
        queryFn: fetchProduct,
    });

    if (product) console.log(product);
    if (isPending) return "Loading";
    if (error) return "An error has occurred";

    return (
        <Stack direction={"row"}>
            <Center w={"40%"}>
                <div style={{width: "65%"}}>
                    <Slider dots={true} infinite={true} speed={500} slidesToShow={1} slidesToScroll={1}>
                        {product.images.map((item, i) => (
                            <div key={i}>
                                <Image src={item.image} objectFit={"contain"} boxSize={"400px"}/>
                            </div>
                        ))}
                    </Slider>
                </div>
            </Center>

            <Box w={"60%"}>
                <Heading>{product.name}</Heading>
                <DiscountSection discount={product.discount} productId={product.id} />
            </Box>
        </Stack>
    )
}

function DiscountSection({ discount, productId }) {
    const { accessToken } = useContext(AuthContext);
    const [percentage, setPercentage] = useState(0);

    const { isOpen, getDisclosureProps, getButtonProps } = useDisclosure();
    const [hidden, setHidden] = useState(!isOpen);


    const toast = useToast();


    const { isPending, mutate } = useMutation({
        mutationFn: async () => {
            let body = {
                percentage,
                product: productId
            }
            const res = await fetch("http://127.0.0.1:8000/products/discount/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${String(accessToken)}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            let data = await res.json();
            if (res.status !== 201) throw data;

            return data;
        },
        onSuccess: () => {
            toast({
                title: 'Success',
                description: "Added discount",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
        },
        onError: () => {
            toast({
                title: 'Error',
                description: "Something went wrong please try again later",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault()
        mutate()
    }

    return (
        <Box>
            <h3>Discount</h3>
            <Flex direction={"row"} alignItems={"center"}>
                {discount === null
                    ?
                    <Box mr={"5px"}>
                        <Badge colorScheme="red" fontSize={"1.5rem"}>-0%</Badge>
                    </Box>
                    :
                    <Box>
                        <Badge colorScheme="green" fontSize={"1.5rem"}>-100%</Badge>
                    </Box>
                }

                <motion.div
                    {...getDisclosureProps()}
                    hidden={hidden}
                    initial={false}
                    onAnimationStart={() => setHidden(false)}
                    onAnimationComplete={() => setHidden(!isOpen)}
                    animate={{ width: isOpen ? 300 : 0 }}
                    style={{
                        overflow: "hidden",
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <InputGroup>
                            <NumberInput
                                min={1}
                                max={100}
                                placeholder="Add your discount percentage"
                                size="md"
                                required
                                onChange={(value) => setPercentage(value)}
                            >
                                <NumberInputField />
                            </NumberInput>
                            <InputRightAddon bgColor={"transparent"} p={0}>
                                <Flex>
                                    <IconButton
                                        {...getButtonProps()}
                                        icon={<CloseIcon color={"red"}/>}
                                        borderRadius={0}
                                    />
                                    <IconButton
                                        type="submit"
                                        icon={<CheckIcon color={"green"}/>}
                                        borderStartRadius={0}
                                    />
                                </Flex>
                            </InputRightAddon>
                        </InputGroup>
                    </form>
                </motion.div>
                {hidden &&
                    (discount === null
                    ?                    
                        <IconButton
                            aria-label="Delete discount"
                            icon={<AddIcon />}
                            {...getButtonProps()}
                    />
                    :

                    <IconButton
                        aria-label="Delete discount"
                        isDisabled={discount ? false : true}
                        icon={<DeleteIcon />}
                    />
                    )
                }
            </Flex>

        </Box>
    )
}