import { ContextProps, useAuth } from '@/contexts/authContext';
import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Link, Outlet, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export interface RouterContext {
  auth: ContextProps;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  const { authState, logout } = useAuth();

  const handleLogout = () => {
    logout()
    redirect({
      to: '/login',
    })
  }

  return (
    <>
      <div className='flex bg-red-200'>
        <Link to='/' className='[&.active]:font-bold'>Home</Link>{' '}
        <Link to='/about' className='[&.active]:font-bold'>About</Link>{' '}
        {authState.isAuth ?
          <div className='flex'>
            <Link to='/profile'>Profile</Link>
            <p onClick={handleLogout} className='hover:cursor-pointer'>Log out</p>
          </div>
          :
          <Link to='/login'>Login</Link>
        }
      </div>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  )
}