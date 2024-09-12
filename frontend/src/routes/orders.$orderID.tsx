import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/authContext';
import { formattedVND } from '@/lib/formatCurrency';
import { formatDateString } from '@/lib/formatDate';
import { setStatusColor } from '@/lib/formatStyles';
import { Order } from '@/types/order';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router';
import { CircleX } from 'lucide-react';


const fetchOrder = async (orderID: string, authToken:string): Promise<Order> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/order/${orderID}`,{
    headers: {'Authorization': `Bearer ${authToken}`}
  })
  if (res.status !== 200) {
    throw new Error('An error has occurred. Please try again later.')
  }

  return await res.json();
}

export const Route = createFileRoute('/orders/$orderID')({
  component: OrderDetailPage,
  loader: async ({ params: { orderID }, context }) => await fetchOrder(orderID, context.auth.authState.authToken as string),
  beforeLoad: ({ context }) => {
    if (!context.auth.authState.isAuth) {
      throw redirect({
        to: '/login',
      })
    }
  }
})

function OrderDetailPage() {
  const order = Route.useLoaderData();
  const orderItems = order.items;

  const { authState } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const cancelOrderRequest = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/order/${order.id}/cancel/`, {
      method: 'PATCH',
      headers: {'Authorization': `Bearer ${authState.authToken}`}
    })
    const data = await res.json();

    if (!res.ok) return new Error('An error has occurred. Please try again later.');

    return data
  }

  const {mutate:doCancel, isPending} = useMutation({
    mutationFn: cancelOrderRequest,
    onError: (err) => {
      toast({
        title: 'Error',
        description: err.message
      })
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Order canceled successfully.'
      })
      navigate({to: '/profile'})
    }
  })

  const handleClick = () => {
    doCancel()
  }

  return (
    <div className='flex flex-col justify-center items-center p-5'>
      <div className='w-1/3 p-2 rounded-md bg-gray-300'>
        <div className='flex justify-between border-dashed border-black border-b text-lg'>
          <h1>#{order.id}</h1>
          <p className={setStatusColor(order.status)}>{order.status}</p>
        </div>
        <div className='pb-3 border-dashed border-black border-b'>
          <p className='text-xl font-semibold'>ITEMS</p>
          {orderItems.map((item, index) => (
            <Link
              key={index}
              to='/products/$productSlug'
              params={{productSlug: item.product.slug}}
            >              
              <div className='flex items-center p-2 hover:bg-slate-300 hover:shadow-xl hover:cursor-pointer'>
                <div className='w-24 h-24'>
                  <img src={item.product.image} className='h-full w-full object-contain'/>
                </div>
                <div className='flex-grow'>
                  <div>
                    <p>{item.product.name}</p>
                    <div className='flex justify-between'>
                      <p>Quantity: {item.quantity}</p>
                      <p>{formattedVND(item.total_price)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className='flex justify-between'>
          <div>
            <p>Order Date:</p>
            <p>Address:</p>
            <p>Payment type:</p>
            <p>Total price:</p>
          </div>
          <div className='text-end'>
            <p>{formatDateString(order.created_at)}</p>
            <p>{order.address}</p>
            <p>{order.payment_type}</p>
            <p>{formattedVND(order.total_price)}</p>
          </div>
        </div>
      </div>
      <div>
        {order.status === 'PROCESSING' &&
          <Button
            onClick={handleClick}
            disabled={isPending}
            type='button'
            className='flex flex-col items-center border-2 border-red-500 bg-white h-20 w-20 text-red-500 hover:bg-red-500 hover:text-white'
          >
            <CircleX />
            <p>Cancel</p>
          </Button>
        }
      </div>
    </div>
  )
}