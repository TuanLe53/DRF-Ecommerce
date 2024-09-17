import ProductCard from '@/components/productCard';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Product } from '@/types/product';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, notFound } from '@tanstack/react-router'
import { useState } from 'react';

const validCategories = ['shirts', 'sneaker'];

interface FetchResult{
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

const fetchProducts = async (page: number, category: string):Promise<FetchResult> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/?category=${category}&page=${page}&page_size=12`);
  if(!res.ok) throw new Error('An error has occurred. Please try again later.')
  return await res.json();
}

export const Route = createFileRoute('/$category')({
  component: ProductsByCategoryPage,
  beforeLoad: ({ params }) => {
    if (!validCategories.includes(params.category)) throw notFound();
    return { params };
  },
})

function ProductsByCategoryPage() {
  const { category } = Route.useParams();
  const [page, setPage] = useState<number>(1);

  const { data, error, isFetching } = useQuery({
    queryKey: ['productsByCategory', page],
    queryFn: () => fetchProducts(page, category),
    placeholderData: keepPreviousData,
    staleTime: 5000
  });

  const products = data?.results
  return (
    <div>
      <h1>{category}</h1>
      <div className='flex justify-center items-center'>
        <div
          className='w-4/5 grid grid-cols-4 gap-4 bg-red-300'
        >
          {products?.map((product) => (
            <ProductCard key={product.id} product={product}/>
          ))}
        </div>
      </div>
      <Pagination>
        <PaginationContent>

          {page !== 1 &&
            <PaginationItem>
              <PaginationPrevious onClick={() => setPage(page - 1)}/>
            </PaginationItem>
          }

          {data?.count && Array.from({ length: data.count }).map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => setPage(index + 1)}
                isActive={page === index + 1}
                className='hover:cursor-pointer'
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {data?.count && page < data?.count &&
            <PaginationItem>
              <PaginationNext onClick={() => setPage(page + 1)}/>
            </PaginationItem>
          }

        </PaginationContent>
      </Pagination>
    </div>
  )
}