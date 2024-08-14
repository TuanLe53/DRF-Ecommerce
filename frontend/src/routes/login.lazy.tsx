import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6,  { message: "Password is too short" }).max(50, { message: "Password is too long" }),
})

export const Route = createLazyFileRoute('/login')({
  component: Login
})

function Login() {
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const handleSubmit = (values: z.infer<typeof loginFormSchema>) => {
    console.log(values)
  }

  return (
    <div className='flex flex-col items-center'>
      <h1 className='font-semibold text-3xl mb-3'>Login</h1> 
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(handleSubmit)}>
          <FormField
            control={loginForm.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Enter your email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          >
          </FormField>
          <FormField
            control={loginForm.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' placeholder='Enter your password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          >
          </FormField>

          <Button type='submit' className='mt-3 float-right'>Login</Button>
        </form>
      </Form>
    </div>
  )
}