import { useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { CalendarArrowDown, Plus } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { formatDate, formatDateString } from "@/lib/formatDate";
import { Calendar } from "./ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useAuth } from "@/contexts/authContext";
import { useToast } from "./ui/use-toast";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
    provider: z.enum(["VISA", "MASTERCARD"]),
    account_number: z.string().min(8).max(20),
    expiry_date: z.date({required_error: "An expiry date is required."}),
});

export default function AddPaymentDialog() {
    const { authState } = useAuth();
    const { toast } = useToast();
    const [isOpen, setOpen] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            provider: "VISA",
            account_number: "",
            expiry_date: new Date(),
        }
    });

    const createRequest = async (values: any) => {
        const res = await fetch("http://127.0.0.1:8000/payments/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${authState.authToken}`,
                "Content-type": "application/json"
            },
            body: JSON.stringify(values)
        })

        const data = await res.json()
        if (res.status !== 201) {
            throw new Error("An error has occurred. Please try again later.")
        }

        return data
    }

    const {mutate: doCreate, isPending} = useMutation({
        mutationFn: createRequest,
        onError: (err) => {
            toast({
                title: "Error",
                description: err.message
            })
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Created"
            })
        }
    })

    const handleCancel = () => {
        setOpen(false)
        form.reset()
    }

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        const body = {...values, expiry_date: formatDate(values.expiry_date)}
        doCreate(body)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button><Plus />Add Payment</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add your payment method</DialogTitle>
                    <DialogDescription>Fill out the form to add a payment method.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <FormField
                            control={form.control}
                            name="provider"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Provider</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Please select your provider"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {formSchema.shape.provider.options.map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="account_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your account number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="expiry_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expiry Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button>
                                                    {field.value ? (
                                                        formatDateString(field.value)
                                                    ) : (
                                                        <span>Pick a date</span>  
                                                    )}
                                                    <CalendarArrowDown />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" onClick={handleCancel}>Cancel</Button>
                            <Button type="submit" disabled={isPending}>Create</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}