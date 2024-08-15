import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/authContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { createLazyFileRoute, Link, useNavigate } from '@tanstack/react-router'
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
  const {updateAuthState} = useAuth();
  const navigate = useNavigate({from: '/login'});

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const login = async (body: z.infer<typeof loginFormSchema>) => {
    const res = await fetch('http://127.0.0.1:8000/user/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (res.status !== 200) {
      throw data
    }

    return data
  }

  const {mutate: doLogin, isPending} = useMutation({
    mutationFn: login,
    onError: (err) => {
      console.log(err)
    },
    onSuccess: (data) => {
      updateAuthState(data.access)
      localStorage.setItem('refreshToken', data.refresh)
      navigate({to: '/'})
    }
  })

  const handleSubmit = (values: z.infer<typeof loginFormSchema>) => {
    doLogin(values)
  }

  return (
    <div className='flex flex-col items-center'>
      <h1 className='font-semibold text-3xl mb-3'>Login</h1> 
      <Form {...loginForm}>
        <form
          className='w-4/5 lg:w-2/5 p-2 rounded-xl bg-gray-200'
          onSubmit={loginForm.handleSubmit(handleSubmit)}
        >
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
          
          <div className='mt-3 flex items-center justify-end'>
            <Link to='/register' className='mr-3'>Register</Link>
            <Button
              type='submit'
              disabled={isPending}
            >
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}