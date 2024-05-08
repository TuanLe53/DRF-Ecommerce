import {
    Box,
    Button,
    Card,
    CardFooter,
    Flex,
    IconButton,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spacer,
    Stack,
    Text,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import { VNDDong } from "../utils/VNDDongFormat";
import { DeleteIcon } from "@chakra-ui/icons";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { useBoundStore } from "../store/store";

export default function CartItem({ item }) {
    const { accessToken } = useContext(AuthContext);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const removeItem = useBoundStore((store) => store.removeItem);

    const { isPending, mutate:RemoveItem } = useMutation({
        mutationFn: async () => {
            const res = await fetch(`http://127.0.0.1:8000/customer/cart/item/${item.id}`, {
                method: "DELETE",
                headers: {"Authorization": `Bearer ${String(accessToken)}`,}
            })

            if (res.status !== 204) throw new Error("Failed to delete item from cart.");;

            return "Success"
        },
        onSuccess: () => {
            removeItem(item.id)
            toast({
                title: 'Success',
                description: "Removed from cart",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
            onClose()
        },
        onError: () => {
            toast({
                title: 'Error',
                description: "Something went wrong. Please try again later.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            onClose()
        }
    })

    return (
        <>
            <Card direction={"row"} marginBottom={"5px"} p={"10px"} borderRadius={"14px"}>
                <Image
                    objectFit="contain"
                    src={item.product.images[0].image}
                    maxW={"100px"}
                />

                <Flex w={"100%"} align={"center"} pl={"10px"}>
                    <Box>
                        <Text>{item.product.name}</Text>
                        <Text>Quantity: {item.quantity}</Text>
                    </Box>

                    <Spacer />

                    <Stack>
                        <Box textAlign={"right"}>
                            <Text>{VNDDong.format(item.product.price)}</Text>
                            <Text>Total: {VNDDong.format(item.product.price * item.quantity)}</Text>
                        </Box>
                    </Stack>

                    <CardFooter>
                        <IconButton
                            aria-label="Remove item"
                            icon={<DeleteIcon color={"red"}/>}
                            variant={"outline"}
                            float={"right"}
                            onClick={onOpen}
                        />
                    </CardFooter>
                </Flex>
            </Card>
        
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Remove Item</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Are you sure you want to remove {item.product.name} from your cart?</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={onClose}>No</Button>
                        <Button isLoading={isPending} onClick={RemoveItem}>Yes</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}