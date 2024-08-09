import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/login')({
  component: Login
})

function Login() {
  return (
    <div>
      <h1>Login</h1>
      <form>
        
      </form>
    </div>
  )
}