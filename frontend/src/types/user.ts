export interface User{
    username: string | null;
    id: string | null;
    user_type: 'VENDOR' | 'CUSTOMER' | null;
}

export interface Vendor {
    shop_name: string;
    description: string;
    city: string;
    address: string;
    phone_number: string;
    avatar: string | undefined;
    cover_photo: string | null;
    closed: boolean;
}

export interface Payment{
    id: string;
    provider: string;
    account_number: string;
    expiry_date: string;
    created_at: string;
    is_default: boolean
}