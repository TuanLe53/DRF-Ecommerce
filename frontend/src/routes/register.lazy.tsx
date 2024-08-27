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
import { useMutation } from '@tanstack/react-query'
import { Textarea } from '@/components/ui/textarea'


const userInfoFormSchema = z.object({
  first_name: z.string().max(50, {message: 'First name is too long'}).min(1, {message: 'First name is too short'}),
  last_name: z.string().max(50, {message: 'Last name is too long'}).min(1, {message: 'Last name is too short'}),
  email: z.string().email(),
  password: z.string().min(6, { message: "Password is too short" }).max(50, { message: "Password is too long" }),
  user_type: z.enum(['VENDOR', 'CUSTOMER'])
});

const vendorFormSchema = z.object({
  shop_name: z.string().min(10, {message: 'Shop name is too short'}).max(50, {message: 'Shop name is too long'}),
  description: z.string().min(50, {message: 'Your description is too short'}).max(255, {message: 'Your description is too long'}),
  address: z.string().min(10, {message: 'Your address is too short'}).max(125, {message: 'Your address is too long'}),
  city: z.string().min(3, {message: 'City name is too short'}).max(125, {message: 'City name is too long'}),
  phone_number: z.string().min(10).max(11)
});

export const Route = createLazyFileRoute('/register')({
  component: Register
});

function Register() {
  const userInfoForm = useForm<z.infer<typeof userInfoFormSchema>>({
    resolver: zodResolver(userInfoFormSchema),
    defaultValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: ''
    }
  })

  const [step, setStep] = useState<number>(0);
  const [direction, setDirection] = useState(1);
  const [ref, bounds] = useMeasure();

  const STEPS = 2;

  const handleSetStep = (newStep: number) => {
    setDirection(newStep > step ? 1 : -1)
    setStep(newStep)
  }

  const [userInfo, setUserInfo] = useState<z.infer<typeof userInfoFormSchema>>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    user_type: 'CUSTOMER'
  });

  const goToNextStep = (values: z.infer<typeof userInfoFormSchema>) => {
    setUserInfo(values)
    handleSetStep(step + 1)
  }

  useEffect(() => {
    if (step < 0) setStep(0);
    if (step >= STEPS) setStep(STEPS - 1);
  }, [step]);

  return (
    <div className='flex flex-col items-center'>
      <h1 className='font-semibold text-3xl mb-3'>Register</h1>

      <div className='w-4/5 lg:w-2/5 p-2 rounded-xl bg-gray-200'>
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
            <form onSubmit={userInfoForm.handleSubmit(goToNextStep)}>
              <FormField
                control={userInfoForm.control}
                name='first_name'
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
                name='last_name'
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
                name='user_type'
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
                        {userInfoFormSchema.shape.user_type.options.map((option) => (
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
              
              <Button type='submit' className='mt-3 float-right'>Next</Button>
            </form>
          </Form>

          <CommonForm handleSetStep={handleSetStep} step={step} userInfo={userInfo} user_type={userInfo.user_type} />
        </TransitionPanel>
      </div>
    </div>
  )
}

async function register(body: any, user_type: 'VENDOR' | 'CUSTOMER') {
  const res = await fetch(`http://127.0.0.1:8000/${user_type.toLowerCase()}/new/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  if (res.status !== 201) {
    throw new Error('Please try again later.')
  }

  return data
}

interface FormFieldComponentProps{
  name: string;
  control: any;
  label: string;
  placeholder: string;
}

function FormFieldComponent({name, control, label, placeholder}:FormFieldComponentProps) {
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {name === 'description' ?
              <Textarea placeholder={placeholder} {...field} />
            :
              <Input placeholder={placeholder} {...field} />
            }
          </FormControl>
          <FormDescription>This is your public vendor's {label.toLowerCase()}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
};

interface CommonFormProps{
  user_type: 'VENDOR' | 'CUSTOMER';
  userInfo: z.infer<typeof userInfoFormSchema>;
  handleSetStep: (newStep: number) => void;
  step: number;
};

function CommonForm({user_type, userInfo, handleSetStep, step}:CommonFormProps) {
  const formSchema =
    user_type === 'VENDOR' ?
      vendorFormSchema :
      vendorFormSchema.omit({ shop_name: true, description: true });
  
  const defaultValues =
    user_type === 'VENDOR' ?
      {
        address: '',
        city: '',
        phone_number: ''
      } :
      {
        shop_name: '',
        description: '',
        address: '',
        city: '',
        phone_number: ''
      }
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  });

  const {mutate: doRegister, isPending} = useMutation({
    mutationFn: ({body, user_type}:{body:any, user_type: 'VENDOR' | 'CUSTOMER'}) => register(body, user_type),
    onError: (err) => {
      console.log(err)
    },
    onSuccess: () => {
      console.log('Success')
    }
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const body = {
      ...values,
      user: userInfo
    }

    doRegister({body, user_type})
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {user_type === 'VENDOR' &&
          <>
            <FormFieldComponent
              name='shop_name'
              label='Shop name'
              placeholder='Enter your shop name'
              control={form.control}
            />
            <FormFieldComponent
              name='description'
              label='Description'
              placeholder='Enter your shop description'
              control={form.control}
            />
          </>
        }

        <FormFieldComponent
          name='address'
          label='Address'
          placeholder='Enter your address'
          control={form.control}
        />
        <FormFieldComponent
          name='city'
          label='City'
          placeholder='Enter your city'
          control={form.control}
        />
        <FormFieldComponent
          name='phone_number'
          label='Phone number'
          placeholder='Enter your phone number'
          control={form.control}
        />

        <div className='flex gap-x-1 justify-end'>
          <Button
            type='button'
            onClick={() => handleSetStep(step - 1)}
          >
            Back
          </Button>
          <Button
            type='submit'
            className='bg-sky-500 hover:bg-sky-400'
            disabled={isPending}
          >
            Register
          </Button>
        </div>
      </form>
    </Form>
  )
}