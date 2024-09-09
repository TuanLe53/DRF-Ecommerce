import { Product } from '@/types/product';
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

const validCategories = ['shirts', 'sneaker'];

const fetchProducts = async (category: string):Promise<Product[]> => {
  const res = await fetch(`http://127.0.0.1:8000/products/?category=${category}&limit=10`);
  if(!res.ok) throw new Error('An error has occurred. Please try again later.')
  const data = await res.json();
  return data.results;
}

export const Route = createFileRoute('/$category')({
  component: ProductsByCategoryPage,
  beforeLoad: ({ params }) => {
    if (!validCategories.includes(params.category)) throw notFound();
    return { params };
  },
  loader: async ({ params }) => await fetchProducts(params.category),
})

function ProductsByCategoryPage() {
  const { category } = Route.useParams();
  const products = Route.useLoaderData();
  
  console.log(products)

  return (
    <div>
      <h1>{category}</h1>
    </div>
  )
}