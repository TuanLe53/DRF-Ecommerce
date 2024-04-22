import { Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export default function Product() {
    
    const { product_id } = useParams();

    const fetchProduct = async () => {
        let res = await fetch(`http://127.0.0.1:8000/products/${product_id}`)
        let data = await res.json()

        return data
    }

    const { isPending, error, data } = useQuery({
        queryKey: ["product"],
        queryFn: fetchProduct,
    });

    if (data) console.log(data);
    if (isPending) return "Loading";
    if (error) return "An error has occurred";

    return (
        <>
            <Text>This page is for customer</Text>
        </>
    )
}