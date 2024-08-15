export interface User{
    username: string | null;
    id: string | null;
    type: 'VENDOR' | 'CUSTOMER' | null;
}