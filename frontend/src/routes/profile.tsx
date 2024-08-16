import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { UserRound, Plus } from 'lucide-react';

const fetchProfile = async (authToken: string) => {
    const res = await fetch('http://127.0.0.1:8000/user/profile/', {
        headers: { 'Authorization': `Bearer ${authToken}` },
    });

    return await res.json()
}

export const Route = createFileRoute('/profile')({
    beforeLoad: ({ context, location }) => {
        if (!context.auth.authState.isAuth) {
            throw redirect({
                to: '/login',
                search: {
                    redirect: location.href,
                }
            })
        }
    },
    loader: async ({context}) => await fetchProfile(context.auth.authState.authToken as string),
    component: Profile,
})

function Profile() {
    const profile = Route.useLoaderData();

    return (
        <div className='flex gap-10 pt-8 px-20 bg-green-200'>
            <div className='w-1/4 p-2 rounded-xl flex flex-col items-center bg-blue-200'>
                <Avatar className='h-20 w-20'>
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback>
                        <UserRound />
                    </AvatarFallback>
                </Avatar>
                <p>{profile.user.first_name} {profile.user.last_name}</p>
                <div className='w-full'>
                    <p>Email: {profile.user.email}</p>
                    <p>Phone: {profile.phone_number}</p>
                </div>
            </div>
            <div className='grow'>
                <div>
                    <h1>{profile.shop_name}</h1>
                    <p>{profile.description}</p>
                </div>
                <div>
                    <div>
                        <h1>Products</h1>
                        <Button><Plus />Add Product</Button>
                    </div>
                    
                    <ProductList />
                </div>
            </div>
        </div>
    )
}

function ProductList() {
    
    return (
        <div>
            <p>Product List</p>
        </div>
    )
}