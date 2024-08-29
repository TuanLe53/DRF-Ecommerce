export interface User{
    username: string | null;
    id: string | null;
    user_type: 'VENDOR' | 'CUSTOMER' | null;
}

export interface Payment{
    id: string;
    provider: string;
    account_number: string;
    expiry_date: string;
    created_at: string;
    is_default: boolean
}