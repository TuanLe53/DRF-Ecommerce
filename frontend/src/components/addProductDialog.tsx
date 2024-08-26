import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { useState } from 'react';
import { Textarea } from './ui/textarea';
import CategoriesDropdown from './categoriesDropdown';
import { Label } from './ui/label';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { useAuth } from '@/contexts/authContext';

const formSchema = z.object({
    name: z.string().min(6).max(125),
    description: z.string().min(50),
    price: z.number().min(1000),
    quantity: z.number().gt(0),
})

export default function AddProductDialog() {
    const { authState } = useAuth();
    const [isOpen, setOpen] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            quantity: 0,
        }
    })
    const [categories, setCategories] = useState<string[]>([]);

    const [imagesPreview, setImagesPreview] = useState<FileList | null>(null);
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImagesPreview(e.target.files)
    }
    
    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        if (categories.length === 0) {
            return;
        }
        if (!files) {
            console.log("Failed dut to lack of images")
            return;
        }

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price.toString());
        formData.append('quantity', data.quantity.toString());

        files.forEach((img) => {
            formData.append("images", img);
        });

        categories.forEach((category) => {
            formData.append("categories", category);
        })

        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }
        const res = await fetch('http://127.0.0.1:8000/products/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authState.authToken}`,
            },
            body: formData
        })

        // const x = await res.json();

        if (res.status === 201) {
            console.log('success')
            setOpen(false)
        } else {
            console.log('failed')
        }
    }

    const files = imagesPreview ? [...imagesPreview] : null

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button><Plus />Add Product</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a product to your vendor</DialogTitle>
                    <DialogDescription>Fill out the form to add a product to your vendor.</DialogDescription>
                </DialogHeader>
                <ScrollArea style={{height: '600px'}}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className='px-1'>
                            <fieldset>
                                <FormField
                                    control={form.control}
                                    name='name'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product's Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder='Enter your product name' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                ></FormField>

                                <FormField
                                    control={form.control}
                                    name='description'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product's Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder='Enter your product description' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                ></FormField>

                                <FormField
                                    control={form.control}
                                    name='price'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product's price</FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder='Enter your product sku' {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                ></FormField>

                                <FormField
                                    control={form.control}
                                    name='quantity'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product's quantity</FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder='Enter your product sku' {...field} onChange={(e) => field.onChange(Number(e.target.value))}/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                ></FormField>

                                <Label>Categories</Label>
                                <CategoriesDropdown setState={setCategories} />
                                
                                <Input type='file' accept='image/*' multiple onChange={handleImageChange}/>
                                <ScrollArea className='mt-3 p-2 whitespace-nowrap rounded-md border' style={{width: '455px'}}>
                                    <div className='flex w-max space-x-4'>
                                        {files && files.map((img, index) => (
                                            <img src={URL.createObjectURL(img)} key={index} style={{width: '150px', height:'200px'}}/>
                                        ))}
                                    </div>
                                    <ScrollBar orientation='horizontal'/>
                                </ScrollArea>
                                
                                <Button
                                    type='submit'
                                    className='mt-4 float-right'
                                >
                                    Create
                                </Button>
                            </fieldset>
                        </form>
                    </Form>
                </ScrollArea>

            </DialogContent>
        </Dialog>
    )
}