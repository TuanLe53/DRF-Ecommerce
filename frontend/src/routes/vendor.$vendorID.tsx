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
      <div className='w-3/4 bg-blue-400 mx-auto flex flex-row'>
        <div className='relative w-1/4'>
          <img src={vendor.cover_photo ? vendor.cover_photo : Cover} alt='' className='object-cover w-full h-32'/>
          <div className='absolute top-10 left-5'>
            <Avatar>
              <AvatarImage src={vendor.avatar} />
              <AvatarFallback>
                <UserRound />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div>
          <p>{vendor.shop_name}</p>
          <p>{vendor.city}</p>
          <p>{vendor.address}</p>
          <p>{vendor.phone_number}</p>
        </div>
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
    <div className='w-3/4 mx-auto flex flex-row flex-wrap gap-5'>
      {products.map((pd) => (
        <ProductCard product={pd}/>
        
      ))}
    </div>
  )
}