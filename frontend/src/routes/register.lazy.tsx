import { createLazyFileRoute } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const formSchema = z.object({
  firstName: z.string().max(50),
  lastName: z.string().max(50),
  email: z.string().email(),
  password: z.string().min(6,  { message: "Password is too short" }).max(50, { message: "Password is too long" }),
  userType: z.enum(['VENDOR', 'CUSTOMER'])
})


export const Route = createLazyFileRoute('/register')({
  component: Register
})

function Register() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    }
  })

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    
    console.log(values)
  }

  return (
    <div className='flex flex-col justify-between items-center'>
      <h1>Register</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='w-4/5 lg:w-2/5 p-2 rounded-xl'>
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter your first name' {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          >
          </FormField>
          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter your last name' {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          >
          </FormField>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' placeholder='Enter your email' {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          >
          </FormField>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' placeholder='Enter your password' {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          >
          </FormField>

          <FormField
            control={form.control}
            name='userType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Please select your role' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {formSchema.shape.userType.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          >

          </FormField>

          <Button type='submit' className='float-right'>Register</Button>
        </form>
      </Form>
    </div>
  )
}