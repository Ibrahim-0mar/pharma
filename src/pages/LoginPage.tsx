/**
 * @file Login Page Component
 * @module pages/LoginPage
 * @description Handles user authentication for the Doctor's Prescription System
 */

import customAxios from '@/lib/axios/axios.config';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import {
  loginSchema,
  type LoginFormValues,
} from '../lib/schemas/login.schema';
import { cn } from '../lib/utils';

/**
 * Login page component with form validation
 * @component
 */
export default function LoginPage() {
  const nav = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userType: 'pharmacist',
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  /**
   * Form submission handler
   * @async
   * @param {LoginFormValues} values - Form values
   */
  const onSubmit = async (values: LoginFormValues) => {
    try {
      // TODO: remove this line after testing api
      localStorage.setItem('userData', JSON.stringify(values));
      // Make API call to login pharmacist
      const { data } = await customAxios.post('/LoginPharmacist', {
        email: values.email,
        password: values.password,
      });

      // TODO: check backend response and show toast message based on that
      toast.success('Login successful!');
      nav('/dashboard');
    } catch (error) {
      console.error(`[LoginPage]`, error.message);
      toast.error(error.message || 'Login failed. Please try again.');
    }
  };

  return (
    <main className='flex flex-col items-center justify-center lg:flex-row'>
      <div className='flex items-center justify-center flex-1 min-h-screen'>
        <div className='p-6 lg:p-10'>
          <h1 className='mb-6 text-3xl font-bold'>
            Login to Doctor's Prescription System
          </h1>
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Select your user type and login
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-6'
                >
                  <FormField
                    control={form.control}
                    name='userType'
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex justify-center space-x-4'>
                          <div
                            role='button'
                            tabIndex={0}
                            onClick={() =>
                              field.onChange('pharmacist')
                            }
                            onKeyDown={(e) => {
                              if (
                                e.key === 'Enter' ||
                                e.key === ' '
                              ) {
                                field.onChange('pharmacist');
                              }
                            }}
                            className={cn(
                              'flex items-center flex-col gap-4 text-2xl font-semibold border p-6 rounded-md cursor-pointer',
                              {
                                'bg-primary text-background':
                                  field.value === 'pharmacist',
                              }
                            )}
                          >
                            <UserIcon className='w-16 h-16' />
                            <span>Pharmacist</span>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type='email'
                            placeholder='john@example.com'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type='password'
                            placeholder='********'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='rememberMe'
                    render={({ field }) => (
                      <FormItem className='flex items-center space-x-2'>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                          Remember me
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <CardFooter className='flex flex-col items-start gap-4 px-0'>
                    <Button
                      type='submit'
                      className='w-full'
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting
                        ? 'Logging in...'
                        : 'Login'}
                    </Button>
                    <p>
                      Don't have an account?{' '}
                      <Link
                        to='/register'
                        className='underline text-primary'
                      >
                        Register
                      </Link>
                    </p>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className='flex-1 hidden h-screen bg-gray-100 lg:block'>
        <img
          src='/images/doctor-looking-at-clipboard.jpg'
          alt='Login illustration'
          className='object-cover object-top w-full h-full'
        />
      </div>
    </main>
  );
}
