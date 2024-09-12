import AddPaymentDialog from '@/components/addPaymentDialog';
import AddProductDialog from '@/components/addProductDialog';
import CreateOrder from '@/components/createOrder';
import PaymentCard from '@/components/paymentCard';
import ProductCard from '@/components/productCard';
import StatusSelector from '@/components/statusSelector';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/authContext';
import { formattedVND } from '@/lib/formatCurrency';
import { formatDateString } from '@/lib/formatDate';
import { setStatusColor } from '@/lib/formatStyles';
import { OrderBasicInfo, statusValues } from '@/types/order';
import { CartItem, Product } from '@/types/product';
import { Payment } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { UserRound, CircleMinus } from 'lucide-react';
import { useState } from 'react';

const fetchProfile = async (authToken: string) => {
    const res = await fetch('${import.meta.env.VITE_API_BASE_URL}/user/profile/', {
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
                    <div className='flex flex-col gap-5'>
                        <Cart />
                        <Payments />
                        <Orders />
                    </div>
                }
            </div>
        </div>
    )
}

function Cart() {
    const { authState } = useAuth();

    const fetchCartItems = async (): Promise<CartItem[]> => {
        const res = await fetch('${import.meta.env.VITE_API_BASE_URL}/customer/cart/', {
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

    const total_price = cartItems.reduce<number>((total, item) => {
        return total + (item.product.final_price * item.quantity);
    }, 0)

    const orderItems = cartItems.map(({ quantity, product }) => ({ product_id: product.id, quantity }));

    return (
        <div className='p-2 bg-slate-50'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-medium'>Your Cart</h1>
                <p className='text-xl'>{cartItems.length} {cartItems.length > 1 ? 'Items' : 'Item'}</p>
            </div>
            {cartItems.length > 0 ?
                <>
                    <ScrollArea className='h-96'>
                        {cartItems.map((item, index) => (
                            <CartItemCard item={item} key={index}/>
                        ))}
                    </ScrollArea>
                    <div className='flex justify-end items-center gap-3'>
                        <p className='text-xl'>Total: {formattedVND(total_price)}</p>
                        <CreateOrder items={orderItems}/>
                    </div>
                </>
            
                :
                <div className='flex items-center justify-center'>
                    <p className='text-2xl text-gray-400'>You have no items in your cart yet. Let’s add something to it!</p>
                </div>
            }
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
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/customer/cart/item/${item.id}`, {
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
            queryClient.setQueryData<CartItem[]>(['cart_items'], (cartItems) => 
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
        <div className='my-3 p-2 relative flex items-center gap-2 bg-gray-100 rounded-xl hover:shadow-2xl'>
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

function Payments() {
    const { authState } = useAuth();

    const fetchPayments = async (): Promise<Payment[]> => {
        const res = await fetch('${import.meta.env.VITE_API_BASE_URL}/payments/', {
            headers: { 'Authorization': `Bearer ${authState.authToken}` }
        });
        const data = await res.json();

        if (res.status !== 200) {
            throw new Error('An error has occurred. Please try again later.')
        }

        return data;
    }

    const { isPending, isError, data: payments } = useQuery({
        queryKey: ['payments'],
        queryFn: fetchPayments,
    });

    if (isPending) return <div>Loading...</div>
    if (isError) return <div>Error</div>

    return (
        <div className='p-2 bg-slate-50'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-medium'>Your Payments</h1>
                <AddPaymentDialog />
            </div>
            {payments.length > 0 ?
                <ScrollArea className='h-60'>
                    {payments.map((payment, index) => (
                        <PaymentCard key={index} payment={payment}/>
                    ))}
                </ScrollArea>
                :
                <div className='flex items-center justify-center'>
                    <p className='text-2xl text-gray-400'>You have no payments yet. Let’s add one now!</p>
                </div>
            }
        </div>
    )
};

function Orders() {
    const { authState } = useAuth();
    const [status, setStatus] = useState<statusValues | ''>('');

    const fetchPayments = async (): Promise<OrderBasicInfo[]> => {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/order/?status=${status}`, {
            headers: { 'Authorization': `Bearer ${authState.authToken}` }
        });
        const data = await res.json();

        if (res.status !== 200) {
            throw new Error('An error has occurred. Please try again later.')
        }

        return data;
    }

    const { isPending, isError, data: orders } = useQuery({
        queryKey: ['orders', status],
        queryFn: fetchPayments,
    });

    if (isPending) return <div>Loading...</div>
    if (isError) return <div>Error</div>
    
    return (
        <div className='p-2 bg-slate-50'>
            <div className='flex justify-between'>
                <h1 className='text-3xl font-medium'>Your Orders</h1>
                <StatusSelector status={status} setStatus={setStatus}/>
            </div>
            {orders.length > 0 ?
                <ScrollArea className='h-60'>
                    {orders.map((order) => (
                        <div key={order.id} className='bg-gray-200 rounded-xl p-2 my-3 hover:shadow-2xl hover:cursor-pointer'>
                            <Link to='/orders/$orderID' params={{orderID: order.id}}>
                                <div className='flex justify-between border-b border-black'>
                                    <p>#{order.id}</p>
                                    <p className={setStatusColor(order.status)}>{order.status}</p>
                                </div>
                                <div className='flex gap-10'>
                                    <p>Order Date: {formatDateString(order.created_at)}</p>
                                    <p>Total: {formattedVND(order.total_price)}</p>
                                    <p>Payment type: {order.payment_type}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </ScrollArea>
            :            
                <div className='flex items-center justify-center'>
                    <p className='text-2xl text-gray-400'>You have no payments yet. Let’s add one now!</p>
                </div>    
            }
        </div>
    )
}

function ProductList() {
    const { authState } = useAuth();
    
    const fetchProducts = async (): Promise<Product[]> => {
        const res = await fetch('${import.meta.env.VITE_API_BASE_URL}/products/vendor/', {
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