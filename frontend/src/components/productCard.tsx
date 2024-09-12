import { Link, useRouterState } from "@tanstack/react-router";
import { Ellipsis, CircleX, Pencil } from "lucide-react";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Product } from "@/types/product";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { useAuth } from "@/contexts/authContext";
import { useMutation } from "@tanstack/react-query";
import { formattedVND } from "@/lib/formatCurrency";

interface ProductCardProps{
    product: Product;
}

interface ButtonProps{
    productSlug: string;
}

export default function ProductCard({product}:ProductCardProps) {
    const router = useRouterState();
    return (
            <div
                className="w-56 h-80 bg-slate-50 relative hover:cursor-pointer hover:shadow-2xl"
            >
                {router.location.pathname === '/profile' &&
                <div className="absolute top-1 right-1">
                        <GroupButtons productSlug={product.slug} />    
                </div>
                }
                <Link
                    to="/products/$productSlug"
                    params={{productSlug: product.slug}}            
                >
                <div className="h-3/5">
                    <img
                        src={product.images[0].image}
                        className="h-48 w-96 object-contain"
                    />
                </div>

                <div className="h-2/5 p-1 flex flex-col justify-between">
                    <p className="product-title text-xl">{product.name}</p>
                    <div className="flex flex-col">
                    {product.discount &&
                    <>                    
                        <Badge className="self-end">{product.discount}%</Badge>
                        <p className="self-end line-through">{formattedVND(product.price)}</p>
                    </>    
                    }
                    <p className="self-end justify-self-end text-orange-500 text-2xl">{formattedVND(product.final_price)}</p>
                    </div>
                        
                </div>
                </Link>
            </div>
    )
}

function GroupButtons({productSlug}:ButtonProps) {
    
    return (
        <Popover>
            <PopoverTrigger className="hover:bg-slate-300 rounded-md">
                <Ellipsis />
            </PopoverTrigger>
            <PopoverContent className="w-28">
                <ul>
                    <li>
                        <EditProduct productSlug={productSlug} />
                    </li>
                    <li>
                        <DeleteProduct productSlug={productSlug} />
                    </li>
                </ul>
            </PopoverContent>
        </Popover>
    )
}

function EditProduct({productSlug}:ButtonProps) {
    
    return (
        <Link to="/products/$productSlug/edit" params={{productSlug: productSlug}}>
            <div className="flex justify-between items-center rounded-lg p-1 hover:bg-slate-100 hover:cursor-pointer">
                <p>Edit</p>
                <Pencil size={20} />
            </div>
        </Link>
    )
}

function DeleteProduct({productSlug}:ButtonProps) {
    const [isOpen, setOpen] = useState<boolean>(false);
    const { authState } = useAuth();
    const { toast } = useToast();
    
    const deleteRequest = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${productSlug}`, {
            method: 'DELETE',
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
                title: 'Error',
                description: 'An error occurred. Please try again later.'
            })
        }
    });

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger>
                <div className="flex justify-between items-center rounded-lg p-1 hover:bg-slate-100 hover:cursor-pointer">
                    <p className="text-red-600">Delete</p>
                    <CircleX size={20} color="rgb(220 38 38)"/>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete product</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this product?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={() => handleClick()} disabled={isPending}>Yes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}