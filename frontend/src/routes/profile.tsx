import AddProductDialog from '@/components/addProductDialog';
import ProductCard from '@/components/productCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/authContext';
import { Product } from '@/types/product';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { UserRound } from 'lucide-react';

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
        <div className='h-full flex gap-10 pt-8 px-20 bg-green-200'>
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
                <div className='p-2 rounded-xl bg-slate-50'>
                    <h1 className='text-2xl'>{profile.shop_name}</h1>
                    <p>{profile.description}</p>
                </div>
                <div className='p-2 rounded-xl bg-slate-200'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-2xl font-semibold'>Products</h1>
                        <AddProductDialog />
                    </div>
                    
                    <ProductList />
                </div>
            </div>
        </div>
    )
}

function ProductList() {
    const { authState } = useAuth();
    
    const fetchProducts = async (): Promise<Product[]> => {
        const res = await fetch('http://127.0.0.1:8000/products/vendor/', {
            headers: { 'Authorization': `Bearer ${authState.authToken}` },
        })
        const data = await res.json();
        if (res.status !== 200) throw data;

        return data
    }

    const { isPending, isError, data: products } = useQuery({
        queryKey: ['user_products'],
        queryFn: fetchProducts,
    });

    if (isPending) return <div>Loading...</div>
    if(isError) return <div>Error</div>

    return (
        <div className='flex gap-5 flex-wrap'>
            {products.length === 0 ?    
                <p className='text-center text-4xl'>No products</p>
                :
                <>                
                {products.map((product) => (
                <ProductCard product={product} key={product.id}/>
                ))}
                </>
            }
        </div>
    )
}