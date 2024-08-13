import { createLazyFileRoute } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useState } from 'react'
import useMeasure from 'react-use-measure'
import { TransitionPanel } from '@/components/ui/transitionPanel'


const userInfoFormSchema = z.object({
  firstName: z.string().max(50).min(1),
  lastName: z.string().max(50).min(1),
  email: z.string().email(),
  password: z.string().min(6,  { message: "Password is too short" }).max(50, { message: "Password is too long" }),
  userType: z.enum(['VENDOR', 'CUSTOMER'])
})

const vendorFormSchema = z.object({
  shopName: z.string().min(10).max(50),
  description: z.string().min(50).max(255),
  address: z.string().min(10).max(125),
  city: z.string().min(10).max(125),
  phoneNumber: z.string().min(10).max(11)
})

export const Route = createLazyFileRoute('/register')({
  component: Register
})

function Register() {
  const userInfoForm = useForm<z.infer<typeof userInfoFormSchema>>({
    resolver: zodResolver(userInfoFormSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    }
  })

  const [step, setStep] = useState<number>(0);
  const [direction, setDirection] = useState(1);
  const [ref, bounds] = useMeasure();

  const STEP_COMPONENTS = [
    1,
    2
  ]

  const handleSetStep = (newStep: number) => {
    setDirection(newStep > step ? 1 : -1)
    setStep(newStep)
  }

  const [userInfo, setUserInfo] = useState<z.infer<typeof userInfoFormSchema>>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userType: 'CUSTOMER'
  });

  const goToNextStep = (values: z.infer<typeof userInfoFormSchema>) => {
    setUserInfo(values)
    handleSetStep(step + 1)
  }

  useEffect(() => {
    if (step < 0) setStep(0);
    if (step >= STEP_COMPONENTS.length) setStep(STEP_COMPONENTS.length - 1);
  }, [step]);

  return (
    <div className='flex flex-col justify-between items-center'>
      <h1>Register</h1>

      <div>
        <TransitionPanel
          activeIndex={step}
          variants={{
            enter: (direction) => ({
              x: direction > 0 ? 364 : -364,
              opacity: 0,
              height: bounds.height > 0 ? bounds.height : 'auto',
            }),
            center: {
              zIndex: 1,
              x: 0,
              opacity: 1,
              height: bounds.height > 0 ? bounds.height : 'auto',
            },
            exit: (direction) => ({
              zIndex: 0,
              x: direction < 0 ? 364 : -364,
              opacity: 0,
              position: 'absolute',
              top: 0,
              width: '100%',
            }),
          }}
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          custom={direction}
        >
          <Form {...userInfoForm}>
            <form onSubmit={userInfoForm.handleSubmit(goToNextStep)} className='w-4/5 lg:w-2/5 p-2 rounded-xl'>
              <FormField
                control={userInfoForm.control}
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
                control={userInfoForm.control}
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
                control={userInfoForm.control}
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
                control={userInfoForm.control}
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
                control={userInfoForm.control}
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
                        {userInfoFormSchema.shape.userType.options.map((option) => (
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
              
              <Button type='submit' className='float-right'>Next</Button>
            </form>
          </Form>

          <div>
            {userInfo.userType === 'VENDOR' ? <VendorForm /> : <CustomerForm />}
            <Button onClick={() => handleSetStep(step - 1)}>Back</Button>
            <Button>Register</Button>
          </div>

        </TransitionPanel>
      </div>
    </div>
  )
}

function VendorForm() {
  const form = useForm<z.infer<typeof vendorFormSchema>>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      shopName: '',
      description: '',
      address: '',
      city: '',
      phoneNumber: ''
    }
  });

  const handleSubmit = () => {
    console.log('Submit')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name='shopName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shop name</FormLabel>
              <FormControl>
                <Input placeholder='Enter your vendor name' {...field} />
              </FormControl>
              <FormDescription>This is your public vendor's name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        >
        </FormField>
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder='Enter your vendor description' {...field} />
              </FormControl>
              <FormDescription>This is your public vendor's description</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        >
        </FormField>
        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder='Enter your vendor address' {...field} />
              </FormControl>
              <FormDescription>This is your public vendor's address</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        >
        </FormField>
        <FormField
          control={form.control}
          name='city'
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder='Enter your vendor city' {...field} />
              </FormControl>
              <FormDescription>This is your public vendor's city</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        >
        </FormField>
        <FormField
          control={form.control}
          name='phoneNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input placeholder='Enter your vendor phone number' {...field} />
              </FormControl>
              <FormDescription>This is your public vendor's phone number</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        >
        </FormField>

      </form>
    </Form>
  )
}

function CustomerForm() {
  return (
    <p>Customer</p>
  )
}