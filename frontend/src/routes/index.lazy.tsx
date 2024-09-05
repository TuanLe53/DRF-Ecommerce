import ProductCard from '@/components/productCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { toTitleCase } from '@/lib/formatStyles';
import { Product } from '@/types/product';
import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className='flex gap-10 p-5'>
      <div className='border-black border-r-2 w-1/5'>
        <h1>Category</h1>
        <ul>
          <li>Shirts</li>
          <li>Sneaker</li>
        </ul>
      </div>
      <div>
        <ProductsByCategoryCarousel category='shirts'/>
        <ProductsByCategoryCarousel category='sneaker'/>
      </div>
    </div>
  )
}

interface ProductsByCategoryCarouselProps{
  category: string;
}

function ProductsByCategoryCarousel({category}:ProductsByCategoryCarouselProps) {
  const fetchProducts = async ():Promise<Product[]> => {
    const res = await fetch(`http://127.0.0.1:8000/products/?category=${category}`);
    if(!res.ok) throw new Error('An error has occurred. Please try again later.')
  
    return await res.json();
  }

  const {isPending, isError, data: products} = useQuery({
    queryKey: ['products_by_category', category],
    queryFn: fetchProducts
  })

  if (isPending) return <div>Loading...</div>
  if(isError) return <div>Error</div>

  return (
    <div>
      <h1 className='text-3xl'>{toTitleCase(category)}</h1>
      <Carousel>
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id} className='basis-1/2'>
              <ProductCard product={product}/>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}