import React, { useState } from "react";
import {Plus, X} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@/types/product";

interface DialogProps{
    setState: React.Dispatch<React.SetStateAction<string[]>>;
}

async function getCategories(): Promise<Category[]> {
    const res = await fetch('http://127.0.0.1:8000/products/categories/');
    const data = await res.json();

    if (res.status !== 200) {
        throw data
    }

    return data
}

export default function CategoriesDropdown({setState}:DialogProps){
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    function addCategory(newCategory: string) {
        if (!selectedCategories.includes(newCategory)) {
            setSelectedCategories([newCategory, ...selectedCategories])
            setState((prevState) => [newCategory, ...prevState])
        }
    }
    function removeCategory(category: string) {
        setSelectedCategories((prevState) => prevState.filter((item) => item !== category))
        setState((prevState) => prevState.filter((item) => item !== category))
    }

    const {isPending, isError, data:categories} = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories
    })

    if (isPending) return <div>Loading...</div>
    if(isError) return <div>Error</div>

    return (
        <ul className="flex flex-wrap gap-1">
            {selectedCategories.map((item, index) => (
                <li key={index}>
                    <Badge>{item}<X className="h-4 w-4 hover:cursor-pointer" onClick={() => removeCategory(item)}/></Badge>
                </li>
            ))}
            <Popover>
                <PopoverTrigger>
                    <Badge>Add Category<Plus /></Badge>
                </PopoverTrigger>
                <PopoverContent>
                    <ul>
                        {categories.map((item, index) => (
                            <li
                                className="flex items-center"
                                key={index}
                            >
                                <p
                                    className="hover:cursor-pointer"
                                    onClick={() => addCategory(item.name)}
                                >
                                    {item.name}
                                </p>
                                {selectedCategories.includes(item.name) &&
                                    <X
                                        className="w-4 h-4 hover:cursor-pointer"
                                        onClick={() => removeCategory(item.name)}
                                    />
                                }
                            </li>
                        ))}
                    </ul>
                </PopoverContent>
            </Popover>
        </ul>
    )
}