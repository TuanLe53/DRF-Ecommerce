import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Product } from '@/types/product';
import { createFileRoute, redirect } from '@tanstack/react-router'

const fetchProduct = async (productSlug: string): Promise<Product> => {
  const res = await fetch(`http://127.0.0.1:8000/products/${productSlug}`);
  if(res.status !== 200) throw new Error('Failed to fetch product')

  return await res.json();
}

export const Route = createFileRoute('/products/$productSlug/edit')({
  beforeLoad: ({ context }) => {
    if (!context.auth.authState.isAuth) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: EditProduct,
  loader: async ({ params }) => await fetchProduct(params.productSlug),
})

function EditProduct() {
  const product = Route.useLoaderData();

  return (
    <div className='h-full p-5 flex gap-10 bg-orange-200'>
      <div className='w-2/5 flex flex-col items-center'>
        <Carousel className='w-4/5'>
          <CarouselContent>
            {product.images.map((img, index) => (
              <CarouselItem key={index} className='flex justify-center'>
                <img src={img.image} className='h-49 w-96 object-contain'/>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <div className='flex-grow bg-purple-300'>
        <p>Form sections</p>
      </div>
    </div>
  )
}