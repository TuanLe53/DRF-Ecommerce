import { AddIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList, Tag, TagCloseButton, TagLabel, Wrap, WrapItem } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

export default function ({ selectedCategories, addCategory, removeCategory }) {
    const fetchCategories = async () => {
        let res = await fetch("http://127.0.0.1:8000/products/categories/")
        let data = await res.json()

        return data
    }

    const {isPending, error, data:categories} = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    })

    if (isPending) return "Loading...";
    if (error) return "An error has occurred";

    return (
        <Wrap align="center">
            {selectedCategories?.map((category, i) => (
                <WrapItem key={i}>
                    <Tag>
                        <TagLabel>{category}</TagLabel>
                        <TagCloseButton value={category} onClick={removeCategory} />
                    </Tag>
                </WrapItem>
            ))}
            <WrapItem>
                <Menu>
                    <MenuButton as={Button} leftIcon={<AddIcon />}>Categories</MenuButton>
                    <MenuList>
                        {categories.map((category, i) => (
                            <MenuItem key={i} value={category.name} onClick={addCategory}>{category.name}</MenuItem>
                        ))}
                    </MenuList>
                </Menu>
            </WrapItem>
        </Wrap>
    )
}