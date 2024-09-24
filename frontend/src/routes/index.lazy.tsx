import ProductCard from '@/components/productCard';
import { Button } from '@/components/ui/button';
import { toTitleCase } from '@/lib/formatStyles';
import { Product } from '@/types/product';
import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'

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
      <div className='w-4/5 flex flex-col gap-5'>
        <ProductsByCategoryCarousel category='shirts'/>
        <ProductsByCategoryCarousel category='sneaker'/>
      </div>
    </div>
  )
}

interface ProductsByCategoryCarouselProps{
  category: string;
}

function ProductsByCategoryCarousel({ category }: ProductsByCategoryCarouselProps) {
  const navigate = useNavigate({from: '/'});

  const fetchProducts = async ():Promise<Product[]> => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/?category=${category}&page=1&page_size=4`);
    if(!res.ok) throw new Error('An error has occurred. Please try again later.')
    const data = await res.json();
    return data.results;
  }

  const {isPending, isError, data: products} = useQuery({
    queryKey: ['products_by_category', category],
    queryFn: fetchProducts
  })

  if (isPending) return <div>Loading...</div>
  if(isError) return <div>Error</div>

  return (
    <div className='py-1 px-2 bg-slate-200'>
      <h1 className='text-3xl'>{toTitleCase(category)}</h1>
      <div className='flex gap-5 items-center'>
        {products.map((pd) => (
          <ProductCard product={pd} key={pd.id} />
        ))}
        <div className='w-56 h-80 flex items-center justify-center'>
          <Button
            type='button'
            onClick={() => navigate({to:`/${category}`},)}
            className='rounded-lg w-20 h-12 bg-white border-orange-500 border-2 text-orange-500 hover:bg-orange-500 hover:text-white'
          >
            More
          </Button>
        </div>
      </div>
    </div>
  )
}