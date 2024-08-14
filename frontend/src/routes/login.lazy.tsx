import { createLazyFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6,  { message: "Password is too short" }).max(50, { message: "Password is too long" }),
})

export const Route = createLazyFileRoute('/login')({
  component: Login
})

function Login() {

  return (
    <div className='flex flex-col items-center'>
      <h1 className='font-semibold text-3xl mb-3'>Login</h1>  
      <form>
        
      </form>
    </div>
  )
}