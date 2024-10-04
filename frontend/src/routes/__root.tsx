import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Toaster } from '@/components/ui/toaster';
import { ContextProps, useAuth } from '@/contexts/authContext';
import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Link, Outlet, redirect, useNavigate } from '@tanstack/react-router'
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
          <CategoryDropDown />
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

function CategoryDropDown() {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='hover:underline hover:cursor-pointer  '>
        <div>
          <p className='text-lg'>Category<span className='text-sm'>▼</span></p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate({to:'/$category', params:{category: 'shirts'}})}>
            Shirts
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate({to:'/$category', params:{category: 'sneaker'}})}>
            Sneaker
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}