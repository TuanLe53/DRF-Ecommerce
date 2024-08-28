import AddProductDialog from '@/components/addProductDialog';
import ProductCard from '@/components/productCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/authContext';
import { formattedVND } from '@/lib/formatCurrency';
import { formatDateString } from '@/lib/formatDate';
import { CartItem, Product } from '@/types/product';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { UserRound, CircleMinus } from 'lucide-react';

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
    const { user } = useAuth();

    return (
        <div className='flex gap-10 py-8 px-20 bg-green-200'>
            <div className='w-1/4'>
                <div className='p-2 rounded-xl flex flex-col items-center bg-blue-200'>
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
                        <p>City: {profile.city}</p>
                        <p>Address: {profile.address}</p>
                    </div>
                </div>
            </div>
            <div className='grow'>
                {user.user_type === 'VENDOR' ?
                    <>                    
                        <div className='p-2 mb-5 rounded-xl bg-slate-100'>
                            <h1 className='text-2xl'>{profile.shop_name}</h1>
                            <p>{profile.description}</p>
                        </div>
                        <div className='p-2 rounded-xl bg-slate-100'>
                            <div className='flex justify-between items-center'>
                                <h1 className='text-2xl font-semibold'>Products</h1>
                                <AddProductDialog />
                            </div>
                            
                            <ProductList />
                        </div>
                    </>
                    :
                    <>
                        <Cart />
                    </>
                }
            </div>
        </div>
    )
}

function Cart() {
    const { authState } = useAuth();

    const fetchCartItems = async (): Promise<CartItem[]> => {
        const res = await fetch('http://127.0.0.1:8000/customer/cart/', {
            headers: { 'Authorization': `Bearer ${authState.authToken}` }, 
        });
        const data = await res.json();

        if (res.status !== 200) {
            throw new Error('An error has occurred. Please try again later.')
        }

        return data
    }

    const { isPending, isError, data: cartItems } = useQuery({
        queryKey: ['cart_items'],
        queryFn: fetchCartItems,
    })

    if (isPending) return <div>Loading...</div>
    if (isError) return <div>Error</div>

    return (
        <div>
            {cartItems.map((item, index) => (
                <CartItemCard item={item} key={index}/>
            ))}
        </div>
    )
}

interface CartItemCardProps{
    item: CartItem;
}

function CartItemCard({item}:CartItemCardProps) {
    const product = item.product;
    const notional_price = product.final_price * item.quantity;

    const { authState } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const removeRequest = async () => {
        const res = await fetch(`http://127.0.0.1:8000/customer/cart/item/${item.id}`, {
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${authState.authToken}`}
        })

        if (res.status !== 204) {
            throw new Error('An error has occurred. Please try again later.')
        }
    }

    const {mutate:doDelete} = useMutation({
        mutationFn: removeRequest,
        onError: (err) => {
            toast({
                title: 'Error',
                description: err.message
            })
        },
        onSuccess: () => {
            queryClient.setQueryData<CartItem[]>(['cart_items', { item }], (cartItems) => 
                cartItems ? cartItems.filter((cartItem) => cartItem.id !== item.id) : cartItems
            )
            toast({
                title: 'Success',
                description: `Successfully removed ${product.name} from your cart`
            })
        }
    })

    const removeCartItem = async () => {
        doDelete()
    }
    
    return (
        <div className='p-2 relative flex items-center gap-2 bg-slate-50 rounded-xl'>
            <div className='w-28 h-28'>
                <Link
                    to='/products/$productSlug'
                    params={{productSlug: product.slug}}
                >
                    <img src={product.images[0].image} className='w-full h-full object-contain'/>
                </Link>
            </div>
            <div className='flex-grow'>
                <div className='flex justify-between'>
                    <Link
                        to='/products/$productSlug'
                        params={{productSlug: product.slug}}
                    >
                        {product.name}
                    </Link>
                    <p>Date added to cart: {formatDateString(item.created_at)}</p>
                </div>
                <div className='flex justify-between'>
                    <p>Quantity: {item.quantity}</p>
                    <p>Notional Price: {formattedVND(notional_price)}</p>
                </div>
            </div>
            <div
                className='absolute top-1 right-1 p-1 hover:cursor-pointer'
            >
                <CircleMinus onClick={removeCartItem} className='text-red-500 hover:text-red-400'/>
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
        <div className='flex gap-8 flex-wrap'>
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