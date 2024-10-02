import CreateOrder from '@/components/createOrder'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/authContext'
import { formattedVND } from '@/lib/formatCurrency'
import { Product } from '@/types/product'
import { createFileRoute, Link } from '@tanstack/react-router'
import { CircleAlert } from 'lucide-react'
import React, { useState } from 'react'

const fetchProduct = async (productSlug: string): Promise<Product> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${productSlug}`)
  if (res.status !== 200) {
    throw new Error('Error when get data of this product. Please visit this site later.')
  }
  return await res.json()
}

export const Route = createFileRoute('/products/$productSlug')({
  loader: async ({params:{productSlug}}) => await fetchProduct(productSlug),
  component: ProductPage
})

function ProductPage() {
  const product = Route.useLoaderData();
  const { authState, user } = useAuth();
  const { toast } = useToast();

  const isRenderButton = authState.isAuth && user.user_type === 'CUSTOMER';

  const [quantity, setQuantity] = useState<number>(0);

  const addToCart = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const res = await fetch('${import.meta.env.VITE_API_BASE_URL}/customer/cart/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authState.authToken}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        product: product.id,
        quantity
      })
    })

    if (res.status === 409) {
      toast({
        title: 'Error',
        description: 'Product was already added to your cart.'
      })
      setQuantity(0)
      return;
    } else if (res.status !== 201) {
      toast({
        title: 'Error',
        description: 'An error has occurred. Please try again later.'
      })
      return;
    }

    toast({
      title: 'Success',
      description: 'Product successfully added to cart.'
    })
    setQuantity(0);
  }
  
  const orderItems = [{product_id: product.id, quantity}]

  return (
    <div className='flex p-5'>
      <div className='w-2/5 flex flex-col items-center'>
        <Carousel className='w-4/5'>
          <CarouselContent>
            {product.images.map((img, index) => (
              <CarouselItem key={index} className='flex justify-center'>
                <img src={img.image} className='h-96 w-96 object-contain'/>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <div className='p-1 bg-slate-100 w-4/5'>
        <h1 className='text-4xl'>{product.name}</h1>
        <p className='text-3xl text-orange-500'>{formattedVND(product.final_price)}</p>
        {product.discount &&
          <p className='line-through'>{formattedVND(product.price)} <Badge>{product.discount}%</Badge></p>
        }
        <p className='text-xl'>Vendor: <Link to='/vendor/$vendorID' params={{vendorID: product.vendor_id}}>{product.vendor_name}</Link></p>
        <div className='flex gap-10'>
          <p className='text-xl'>Quantity: {product.quantity}</p>
          <p className='text-xl'>Sold: {product.total_sold_items}</p>
        </div>
        <div>
          <h2 className='text-xl'>Description:</h2>
          <p>{product.description}</p>
        </div>

        {isRenderButton ?
          <>
          <form className='flex w-1/4' onSubmit={addToCart}>
              <Input
                type='number'
                placeholder='Quantity'
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={1}
                max={product.quantity}
                required
              />
            <CreateOrder items={orderItems} disable={quantity < 1 || quantity > product.quantity} />
            <Button type='submit'>Add to cart</Button>
          </form>
          </>
          :
          <div className='flex gap-1 items-center text-red-600'>
            <CircleAlert className='h-4 w-4'/>
            <p>You need to log in as a customer to buy this product.</p>
          </div>
        }

      </div>
    </div>
  )
}