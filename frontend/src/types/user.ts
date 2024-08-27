export interface User{
    username: string | null;
    id: string | null;
    user_type: 'VENDOR' | 'CUSTOMER' | null;
}