import { formattedVND } from '@/lib/formatCurrency';
import { formatDateString } from '@/lib/formatDate';
import { setStatusColor } from '@/lib/formatStyles';
import { Order } from '@/types/order';
import { createFileRoute, Link, redirect } from '@tanstack/react-router'

const fetchOrder = async (orderID: string, authToken:string): Promise<Order> => {
  const res = await fetch(`http://127.0.0.1:8000/order/${orderID}`,{
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

  return (
    <div className='flex justify-center items-center p-5'>
      <div className='w-1/3 p-2 rounded-md bg-gray-300'>
        <div className='flex justify-between border-dashed border-black border-b text-lg'>
          <h1>#{order.id}</h1>
          <p className={setStatusColor(order.status)}>{order.status}</p>
        </div>
        <div className='pb-3 border-dashed border-black border-b'>
          <p className='text-xl font-semibold'>ITEMS</p>
          {orderItems.map((item, index) => (
            <Link
              to='/products/$productSlug'
              params={{productSlug: item.product.slug}}
            >              
              <div key={index} className='flex items-center p-2 hover:bg-slate-300 hover:shadow-xl hover:cursor-pointer'>
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
    </div>
  )
}