import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useState } from "react"
import { z } from "zod"
import { useForm, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { useAuth } from "@/contexts/authContext"
import { Payment } from "@/types/user"
import { useMutation, useQuery } from "@tanstack/react-query"
import AddPaymentDialog from "./addPaymentDialog"
import { formatDateString } from "@/lib/formatDate"
import { useToast } from "./ui/use-toast"

interface OrderItem{
    product_id: string;
    quantity: number
}

interface CreateOrderProps{
    items: OrderItem[],
    disable?: boolean
}

const baseSchema = z.object({
    address: z.string().optional()
})

const formSchema = z.discriminatedUnion(
    "payment_type",
    [
        z.object({
            payment_type: z.literal("COD")
        }).merge(baseSchema),
        z.object({
            payment_type: z.literal("CREDIT_CARD"),
            payment: z.string().uuid()
        }).merge(baseSchema)
    ]
)

export default function CreateOrder({items, disable=false}: CreateOrderProps) {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [selectedPaymentType, setSelectedPaymentType] = useState<"COD" | "CREDIT_CARD">("COD");

    const { authState } = useAuth();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            address: "",
            payment_type: "COD",
        }
    });

    const handlePaymentTypeChange = (value: "COD" | "CREDIT_CARD") => {
        setSelectedPaymentType(value);
        form.setValue("payment_type", value)
        form.resetField("payment")
    }

    const orderRequest = async (values: z.infer<typeof formSchema>) => {
        const body = {
            ...values,
            products: items
        }

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/order/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${authState.authToken}`,
                "Content-type": "Application/json"
            },
            body: JSON.stringify(body)
        })

        if (res.status !== 201) {
            throw new Error("An error has occurred. Please try again later.")
        }

        return await res.json();
    }

    const {isPending, mutate: doOrder} = useMutation({
        mutationFn: orderRequest,
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Order created successfully."
            })
            form.reset()
            setOpen(false)
        },
        onError: () => {
            toast({
                title: "Error",
                description: "An error has occurred. Please try again later."
            })
            form.reset()
            setOpen(false)
        }
    })

    const handleCloseDialog = () => {
        form.reset()
        setOpen(false)
    }

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        doOrder(values)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger type="button" disabled={disable} className="p-2 rounded-md bg-sky-400">
                Order
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Order</DialogTitle>
                    <DialogDescription>Order</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Default" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                    Enter your address, or leave this field blank to use your default address.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="payment_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment type</FormLabel>
                                    <Select onValueChange={handlePaymentTypeChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Please select your payment type"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={"COD"}>
                                                COD
                                            </SelectItem>
                                            <SelectItem value={"CREDIT_CARD"}>
                                                Credit card
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        {selectedPaymentType === "CREDIT_CARD" &&
                            <PaymentSelect form={form} />
                        }
                        
                        <DialogFooter>
                            <Button type="button" onClick={handleCloseDialog}>Cancel</Button>
                            <Button type="submit" disabled={isPending}>Order</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
};

interface PaymentSelectProps{
    form: UseFormReturn<z.infer<typeof formSchema>>;
}

function PaymentSelect({ form }: PaymentSelectProps) {
    const { authState } = useAuth();

    const fetchPayments = async (): Promise<Payment[]> => {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/payments/`, {
            headers: { 'Authorization': `Bearer ${authState.authToken}` }
        });
        const data = await res.json();

        if (res.status !== 200) {
            throw new Error('An error has occurred. Please try again later.')
        }

        return data;
    }

    const { isPending, isError, data: payments } = useQuery({
        queryKey: ['payments'],
        queryFn: fetchPayments,
    });

    if (isPending) return <div>Loading...</div>
    if (isError) return <div>Error</div>
    
    return (
        <FormField
            control={form.control}
            name="payment"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Payment</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Please select your payment method"/>
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {payments.length === 0 &&
                                <div>
                                    <p>You do not have a payment method set up yet. Please add one to continue.</p>
                                    <AddPaymentDialog />
                                </div>
                            }
                            {payments.map((option) => (
                                <SelectItem
                                    key={option.id}
                                    value={option.id}
                                >
                                    <p>{option.provider}</p>
                                    <p>Account Number: {option.account_number}</p>
                                    <p>Expiry date: {formatDateString(option.expiry_date)}</p>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}