import ProductCard from '@/components/productCard';
import { Product } from '@/types/product';
import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <ProductsByCategoryCarousel category='shirts'/>
      <ProductsByCategoryCarousel category='sneaker'/>
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
      {products.map((product, index) => (
        <ProductCard product={product} key={index}/>
      ))}
    </div>
  )
}