import React, { useState } from "react";
import {Plus, X} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";

const sample = ['www', 'sss', 'aaa', 'zzz', 'sssssss', 'ssssss', 'xxzsa', 'xqwqeq', 'sadsadadasas'];

interface DialogProps{
    setState: React.Dispatch<React.SetStateAction<string[]>>;
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
                        {sample.map((item, index) => (
                            <li
                                className="flex items-center"
                                key={index}
                            >
                                <p
                                    className="hover:cursor-pointer"
                                    onClick={() => addCategory(item)}
                                >
                                    {item}
                                </p>
                                {selectedCategories.includes(item) &&
                                    <X
                                        className="w-4 h-4 hover:cursor-pointer"
                                        onClick={() => removeCategory(item)}
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