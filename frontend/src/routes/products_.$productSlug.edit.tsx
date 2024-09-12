import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/authContext';
import { formattedVND } from '@/lib/formatCurrency';
import { Product } from '@/types/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { Plus, Pencil } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const fetchProduct = async (productSlug: string): Promise<Product> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${productSlug}`);
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
      <div className='w-3/5 p-2'>
        <p>Form sections</p>
        <InfoSection product={product} />
        <DescriptionSection product={product}/>
        <PriceSection product={product}/>
      </div>
    </div>
  )
}

interface SectionProps{
  product: Product;
}

function InfoSection({product}:SectionProps) {
  
  return (
    <div className='p-3 rounded-xl bg-slate-50 mb-5'>
      <div className='flex justify-between pb-1 mb-2 border-b-2 border-black'>
        <h1 className='text-2xl font-semibold self-end'>INFO</h1>
        <UpdateDialog product={product}/>
      </div>
      <div className='flex flex-wrap gap-x-20'>
        <p>Name: {product.name}</p>
        <p>Quantity: {product.quantity}</p>
        <p>Sold: {product.total_sold_items}</p>
      </div>
    </div>
  )
}

const updateFormSchema = z.object({
  name: z.string().min(6).max(125),
  quantity: z.number().min(1),
  description: z.string().min(50).max(255),
  price: z.number().min(1000)
})

function UpdateDialog({product}:SectionProps) {
  const { authState } = useAuth();

  const router = useRouter();
  const {toast} = useToast();

  const [isOpen, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof updateFormSchema>>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price
    }
  })

  const updateRequest = async (values: z.infer<typeof updateFormSchema>) => {
    const body = new FormData();
    body.append('name', values.name);
    body.append('description', values.description);
    body.append('price', values.price.toString());

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${product.slug}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authState.authToken}`,
      },
      body: body
    })

    const data = await res.json();

    if (res.status !== 200) {
      throw data
    }

    return data
  }

  const {mutate:doUpdate, isPending} = useMutation({
    mutationFn: updateRequest,
    onError: (err) => {
      console.log(err)
      toast({
        title: 'Error',
        description: 'An error has occurred. Please try again later.'
      })
      setOpen(false)
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'The product has been successfully updated.'
      })
      setOpen(false)
      router.invalidate()
    }
  })

  const handleSubmit = (values: z.infer<typeof updateFormSchema>) => {
    doUpdate(values)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button size={'sm'}>Update<Pencil size={15}/></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update product</DialogTitle>
          <DialogDescription>Update product</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product's Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product's Price</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} onChange={(e) => field.onChange(Number(e.target.value))}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product's Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='p-2 flex justify-end gap-x-2'>
              <Button
                type='button'
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='bg-sky-500 hover:bg-sky-400'
                disabled={isPending}
              >
                Update
              </Button>
            </div>
          </form>
        </Form>

      </DialogContent>
    </Dialog>
  )
}

function DescriptionSection({ product }: SectionProps) {
  return (
    <Accordion type='single' collapsible className='px-3 rounded-xl bg-slate-50 mb-5'>
      <AccordionItem value='item-1'>
        <AccordionTrigger className='flex justify-between pb-1 mb-2 border-b-2 border-black hover:no-underline'>
          <h1 className='text-2xl font-semibold self-end'>DESCRIPTION</h1>
        </AccordionTrigger>
        <AccordionContent>
          {product.description}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function PriceSection({product}:SectionProps) {
  return (
    <div className='p-3 rounded-xl bg-slate-50'>
      <div className='flex justify-between pb-1 mb-2 border-b-2 border-black'>
        <h1 className='text-2xl font-semibold self-end'>PRICE</h1>
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
      const res = await fetch('/products/discount/', {
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
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/discount/${productID}`,{
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