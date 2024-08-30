import { formatDateString } from "@/lib/formatDate"
import { Payment } from "@/types/user"
import { CircleMinus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { useState } from "react"
import { Button } from "./ui/button"
import { useAuth } from "@/contexts/authContext"
import { useToast } from "./ui/use-toast"
import { useMutation } from "@tanstack/react-query"

interface PaymentCardProps{
    payment: Payment
}
export default function PaymentCard({payment}:PaymentCardProps) {
    
    return (
        <div className="flex justify-between items-center my-3 p-2 rounded-xl bg-gray-100 hover:shadow-2xl">
            <div>
                <div className="flex gap-20">
                    <p>Account number: {payment.account_number}</p>
                    <p>Provider: {payment.provider}</p>
                </div>
                <p>Expiry date: {formatDateString(payment.expiry_date)}</p>
            </div>
            <DeletePayment paymentID={payment.id} />
        </div>
    )
}

interface DeletePaymentProps{
    paymentID: string;
}

function DeletePayment({paymentID}:DeletePaymentProps) {
    const [isOpen, setOpen] = useState<boolean>(false);
    const { authState } = useAuth();
    const { toast } = useToast();

    const deleteRequest = async () => {
        const res = await fetch(`http://127.0.0.1:8000/payments/${paymentID}`, {
            method: "DELETE",
            headers: {'Authorization': `Bearer ${authState.authToken}`}
        })

        if (res.status !== 204) {
            const data = await res.json();
            throw data
        }
    }

    const {mutate:handleClick, isPending} = useMutation({
        mutationFn: deleteRequest,
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Product have been deleted'
            })
            setOpen(false)
        },
        onError: () => {
            toast({
                title: "Error",
                description: "An error has occurred. Please try again later."
            })
        }
    })

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger>
                <CircleMinus className="text-red-500 hover:text-red-400 hover:cursor-pointer"/>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete payment</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this payment method?
                    </DialogDescription>
                    <DialogFooter>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={() => handleClick()} disabled={isPending}>Delete</Button>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}