import { Toaster } from '@/components/ui/toaster';
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
      <div className='h-12 p-1 flex bg-red-200 items-center justify-between'>
        <div className='flex gap-2'>
          <Link to='/' className='text-lg [&.active]:font-bold'>Home</Link>
        </div>
        {authState.isAuth ?
          <div className='flex'>
            <Link
              to='/profile'
              className='pr-1 mr-1 border-r-2 border-black hover:underline [&.active]:font-bold'
            >
              Profile
            </Link>
            <p onClick={handleLogout} className='hover:cursor-pointer hover:underline'>Log out</p>
          </div>
          :
          <Link to='/login'>Login</Link>
        }
      </div>
      <Toaster />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  )
}