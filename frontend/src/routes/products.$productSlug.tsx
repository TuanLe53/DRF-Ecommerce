import { Badge } from '@/components/ui/badge'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { formattedVND } from '@/lib/formatCurrency'
import { Product } from '@/types/product'
import { createFileRoute } from '@tanstack/react-router'

const fetchProduct = async (productSlug: string): Promise<Product> => {
  const res = await fetch(`http://127.0.0.1:8000/products/${productSlug}`)
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
        <div className='flex gap-10'>
          <p className='text-xl'>Quantity: {product.quantity}</p>
          <p className='text-xl'>Sold: {product.total_sold_items}</p>
        </div>
        <div>
          <h2 className='text-xl'>Description:</h2>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  )
}