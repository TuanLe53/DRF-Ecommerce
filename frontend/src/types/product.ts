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
    total_sold_items: number;
    images: ProductImage[];
    vendor: string;
    vendor_name: string;
}

export interface ProductBasicInfo extends Pick<Product, "id" | "name" | "slug"> {
    image: string;
    price: string;
}

interface ProductImage{
    image: string;
}

export interface Category{
    name: string;
    description: string;
    slug: string;
}

export interface CartItem{
    id: number;
    cart: string;
    product: Product;
    quantity: number;
    created_at: string;
    updated_at: string;
}