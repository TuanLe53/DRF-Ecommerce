import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/authContext';
import { formattedVND } from '@/lib/formatCurrency';
import { Product } from '@/types/product';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { Plus } from 'lucide-react';
import { useState } from 'react';

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
      <div className='flex-grow p-2 bg-purple-300'>
        <p>Form sections</p>
        <PriceSection product={product}/>
      </div>
    </div>
  )
}

interface PriceProps{
  product: Product;
}

function PriceSection({product}:PriceProps) {
  return (
    <div className='p-3 rounded-xl bg-slate-50'>
      <div className='flex justify-between pb-1 mb-2 border-b-2 border-black'>
        <h1 className='text-2xl font-semibold self-end'>Price</h1>
        {product.discount ?
          <DeleteDiscountDialog productID={product.id} />
          :
          <AddDiscountDialog productID={product.id}/> 
      }
      </div>
      <div className='flex gap-20'>
        <p>Original price: {formattedVND(product.price)}</p>
        <p>Discount: <Badge>{product.discount ? `${product.discount}%` : '0%'}</Badge></p>
        <p>Final price: {formattedVND(product.final_price)}</p>
      </div>
    </div>
  )
}

interface DiscountDialogProps{
  productID: string;
}

function AddDiscountDialog({productID}:DiscountDialogProps) {
  const { authState } = useAuth();
  const [isOpen, setOpen] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<number>(0);

  const { toast } = useToast();
  const router = useRouter();

  const cancelDialog = () => {
    setPercentage(0)
    setOpen(false)
  }

  const {mutate:addDiscount, isPending} = useMutation({
    mutationFn: async () => {
      const res = await fetch('http://127.0.0.1:8000/products/discount/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authState.authToken}`,
          'Content-type': 'application/json'
        },
        body: JSON.stringify({percentage, product:productID})
      })
      if (res.status !== 201) {
        throw Error('Failed. Please try again later')
      }
    },
    onError: (err) => {
      toast({
        title: 'Error',
        description: err.message
      })
      cancelDialog()
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Add discount successfully'
      })
      cancelDialog()
      router.invalidate()
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    addDiscount()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button size={'sm'}><Plus />Add discount</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Discount</DialogTitle>
          <DialogDescription>Add the percentage discount for this product.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            placeholder='Enter your discount percentage'
            type='number'
            min={1}
            max={100}
            step={1}
            value={percentage}
            onChange={(e) => setPercentage(Number(e.target.value))}
            required
          />
          <DialogFooter className='mt-4'>
            <Button type='button' onClick={cancelDialog}>Cancel</Button>
            <Button
              type='submit'
              disabled={isPending}
              className='bg-sky-500 hover:bg-sky-400'
            >
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DeleteDiscountDialog({ productID }: DiscountDialogProps) {
  const [isOpen, setOpen] = useState<boolean>(false);
  const { authState } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const {mutate:deleteDiscount, isPending} = useMutation({
    mutationFn: async () => {
      const res = await fetch(`http://127.0.0.1:8000/products/discount/${productID}`,{
        method: 'DELETE',
        headers: {'Authorization': `Bearer ${authState.authToken}`}
      })

      if (res.status !== 204) {
        throw Error('Failed')
      }
    },
    onError: (err) => {
      toast({
        title: 'Error',
        description: err.message
      })
      setOpen(false)
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Delete discount successfully'
      })
      setOpen(false)
      router.invalidate()
    }
  })

  return (
    <Dialog open={isOpen} onOpenChange={setOpen} >
      <DialogTrigger>
        <Button size={'sm'} className='bg-red-600 hover:bg-red-500'>Delete Discount</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete discount</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the discount for this product?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type='button' onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            type='button'
            onClick={() => deleteDiscount()}
            disabled={isPending}
            className='bg-red-600 hover:bg-red-500'
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}