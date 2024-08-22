export interface Product{
    id: string;
    name: string;
    slug: string;
    description: string;
    categories: string[];
    quantity: number;
    discount: number;
    price: number;
    final_price: number;
    images: ProductImage[];
}

interface ProductImage{
    image: string;
}

export interface Category{
    name: string;
    description: string;
    slug: string;
}