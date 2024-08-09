import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/register')({
  component: () => <div>Hello /register!</div>
})

function Register() {
  
  return (
    <div>
      <h1>Register</h1>
    </div>
  )
}