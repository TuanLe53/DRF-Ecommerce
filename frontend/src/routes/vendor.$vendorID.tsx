import ProductCard from '@/components/productCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Product } from '@/types/product';
import { Vendor } from '@/types/user';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { UserRound } from 'lucide-react';

import Cover from '../assets/images/background.jpg';

const fetchVendorInfo = async (vendorID: string): Promise<Vendor> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/vendor/${vendorID}`);
  if (res.status !== 200) {
    throw new Error('An error has occurred. Please try again later.')
  }
  
  return await res.json()
}

export const Route = createFileRoute('/vendor/$vendorID')({
  component: VendorPage,
  loader: ({params}) => fetchVendorInfo(params.vendorID),
});

function VendorPage() {
  const { vendorID } = Route.useParams();
  const vendor = Route.useLoaderData();

  return (
    <div>
      <img src={vendor.cover_photo ? vendor.cover_photo : Cover} alt='' className='w-1/2 mx-auto'/>
      <div className='bg-red-600 flex justify-center'>
        <Avatar>
          <AvatarImage src={vendor.avatar} />
          <AvatarFallback>
            <UserRound />
          </AvatarFallback>
        </Avatar>
      </div>
      <ProductList vendorID={vendorID} />
    </div>
  )
}

interface ProductListProps{
  vendorID: string;
}

function ProductList({vendorID}:ProductListProps) {
    
  const fetchProducts = async (): Promise<Product[]> => {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/vendor/${vendorID}`)
      const data = await res.json();
      if (res.status !== 200) throw data;

      return data
  }

  const { isPending, isError, data: products } = useQuery({
      queryKey: ['vendor_products'],
      queryFn: fetchProducts,
  });

  if (isPending) return <div>Loading...</div>
  if (isError) return <div>Error</div>
  
  return (
    <div>
      <p>Product List</p>
      {products.map((pd) => (
        <ProductCard product={pd}/>
        
      ))}
    </div>
  )
}