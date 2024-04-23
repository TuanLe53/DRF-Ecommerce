import { Stack, Text, Box, Heading, Wrap, WrapItem, Tag, TagLabel, TagRightIcon, Image, Center } from "@chakra-ui/react";
import { TagFilled } from "@ant-design/icons";
import Slider from "react-slick";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { VNDDong } from "../utils/VNDDongFormat";

export default function Product() {
    
    const { product_id } = useParams();

    const fetchProduct = async () => {
        let res = await fetch(`http://127.0.0.1:8000/products/${product_id}`)
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
        <Stack direction={"row"} spacing={"50px"}>
            <Center w="50%" bg="pink" py={"20px"}>
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

            <Box w="50%" bg="red">
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
                <Text>Description: {product.description}</Text>
            </Box>
        </Stack>
    )
}