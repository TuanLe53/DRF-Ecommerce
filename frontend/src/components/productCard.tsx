import { Link, useRouterState } from "@tanstack/react-router";
import { Ellipsis, CircleX, Pencil } from "lucide-react";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Product } from "@/types/product";

interface ProductCardProps{
    product: Product;
}

export default function ProductCard({product}:ProductCardProps) {
    const router = useRouterState();
    
    return (
        <div
            className="w-56 h-80 bg-slate-50 relative hover:cursor-pointer hover:shadow-2xl"
        >
            {router.location.pathname === '/profile' &&
            <div className="absolute top-1 right-1">
                <GroupButtons />    
            </div>
            }
            <Link
                to="/products/$productSlug"
                params={{productSlug: product.slug}}            
            >
            <div className="h-3/5 bg-green-200">
                <p className="text-center">Hello World</p>
            </div>

            <div className="h-2/5">
                <p className="product-title">New Yorkers are facing the winter chill with less warmth this year as the city's most revered soup stand unexpectedly shutters, following a series of events that have left the community puzzled.</p>
                <Badge>-50%</Badge>
                <p className="line-through">500,000VND</p>
                <p>250,000VND</p>
            </div>
            </Link>
        </div>
    )
}

function GroupButtons() {
    
    return (
        <Popover>
            <PopoverTrigger className="hover:bg-slate-50 rounded-md">
                <Ellipsis />
            </PopoverTrigger>
            <PopoverContent className="w-28">
                <ul>
                    <li>
                        <EditProduct />
                    </li>
                    <li>
                        <DeleteProduct />
                    </li>
                </ul>
            </PopoverContent>
        </Popover>
    )
}

function EditProduct() {
    
    return (
        <div className="flex justify-between items-center rounded-lg p-1 hover:bg-slate-100 hover:cursor-pointer">
            <p>Edit</p>
            <Pencil size={20} />
        </div>
    )
}

function DeleteProduct() {
    
    return (
        <div className="flex justify-between items-center rounded-lg p-1 hover:bg-slate-100 hover:cursor-pointer">
            <p className="text-red-600">Delete</p>
            <CircleX size={20} color="rgb(220 38 38)"/>
        </div>
    )
}