/**
 * @file Registration Page Component
 * @module pages/RegisterPage
 * @description Handles user registration with a multi-step form process for the Doctor's Prescription System
 */

import customAxios from '@/lib/axios/axios.config';
import {
  registerSchema,
  type RegisterFormValues,
} from '@/lib/schemas/register.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserIcon } from 'lucide-react';
import { useState } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import { cn } from '../lib/utils';

/**
 * Registration page component with multi-step form validation
 * @component
 * @example
 * ```tsx
 * <RegisterPage />
 * ```
 *
 * @description
 * Provides a three-step registration process:
 * 1. Account Details - Email and password setup
 * 2. Personal Details - User information collection
 * 3. Confirmation - Review and submit
 *
 * Features:
 * - Form validation using Zod schema
 * - Progressive disclosure with tabs
 * - Real-time validation feedback
 * - Accessible form controls
 * - Responsive layout
 */
export default function RegisterPage() {
  /**
   * Current active tab state
   * @type {string}
   */
  const [activeTab, setActiveTab] = useState('account');
  const nav = useNavigate();

  /**
   * Form instance with Zod schema validation
   * @type {UseFormReturn<RegisterFormValues>}
   */
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userType: 'pharmacist',
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      gender: 'male',
      dob: '',
      height: '',
      weight: '',
    },
  });

  /**
   * Handles tab navigation with form validation
   * @param {string} tab - Target tab identifier
   * @returns {void}
   */
  const handleTabChange = (tab: string) => {
    const { trigger } = form;

    if (tab === 'details') {
      trigger(['email', 'password', 'confirmPassword']).then(
        (isValid) => {
          if (!isValid) {
            toast.error(
              'Please fill out all required account fields correctly.'
            );
            return;
          }
          setActiveTab(tab);
        }
      );
      return;
    }

    if (tab === 'confirmation') {
      trigger(['fullName', 'gender', 'dob', 'height', 'weight']).then(
        (isValid) => {
          if (!isValid) {
            toast.error(
              'Please fill out all required details fields correctly.'
            );
            return;
          }
          setActiveTab(tab);
        }
      );
      return;
    }

    setActiveTab(tab);
  };

  /**
   * Handles form submission for user registration
   * @async
   * @function
   * @param {RegisterFormValues} values - Form values containing user registration data
   * @throws {Error} When API request fails
   *
   * @example
   * ```tsx
   * <form onSubmit={form.handleSubmit(onSubmit)}>
   * ```
   *
   * @description
   * 1. Stores user data in localStorage
   * 2. Makes API request to register pharmacist
   * 3. Navigates to profile page on success
   * 4. Shows success/error toasts
   */
  const onSubmit = async (values: RegisterFormValues) => {
    try {
      // TODO: remove this line after testing api
      localStorage.setItem('userData', JSON.stringify(values));
      // Make API call to register pharmacist
      const { data } = await customAxios.post('/RegisterPharmacist', {
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        height: values.height,
        weight: values.weight,
        gender: values.gender,
        birthOfDate: values.dob,
      });

      // TODO: check backend response and show toast message based on that
      toast.success('Account created successfully!');
      nav('/dashboard/profile');
    } catch (error) {
      console.error(`[RegisterPage]`, error);
      toast.error(
        error.message || 'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <main className='flex flex-col items-center justify-center lg:flex-row'>
      <div className='flex items-center justify-center flex-1 min-h-screen'>
        <div className='p-6 lg:p-10'>
          <h1 className='mb-6 text-3xl font-bold'>
            Register In Doctor's Prescription System
          </h1>
          <Tabs
            value={activeTab}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='account'>Account</TabsTrigger>
              <TabsTrigger value='details'>Details</TabsTrigger>
              <TabsTrigger value='confirmation'>
                Confirmation
              </TabsTrigger>
            </TabsList>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <TabsContent value='account'>
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Details</CardTitle>
                      <CardDescription>
                        Set up your account credentials
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
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
                                placeholder='john@example.com'
                                type='email'
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
                        name='confirmPassword'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
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
                    </CardContent>
                    <CardFooter className='flex flex-col items-start gap-4'>
                      <Button
                        type='button'
                        className='w-32'
                        onClick={() => handleTabChange('details')}
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting
                          ? 'Next Step...'
                          : 'Next'}
                      </Button>
                      <p>
                        Already have an account?{' '}
                        <Link
                          to='/login'
                          className='underline text-primary'
                        >
                          login
                        </Link>
                      </p>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value='details'>
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Details</CardTitle>
                      <CardDescription>
                        Tell us more about yourself
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <FormField
                        control={form.control}
                        name='fullName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='John Doe'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='gender'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder='Select your gender' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='male'>
                                  Male
                                </SelectItem>
                                <SelectItem value='female'>
                                  Female
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='dob'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input
                                type='date'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='height'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height (cm)</FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                placeholder='170'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='weight'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (kg)</FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                placeholder='70'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter className='flex items-center gap-4'>
                      <Button
                        type='button'
                        className='w-32'
                        onClick={() =>
                          handleTabChange('confirmation')
                        }
                      >
                        Next
                      </Button>
                      <Button
                        type='button'
                        variant='outline'
                        className='w-32'
                        onClick={() => setActiveTab('account')}
                      >
                        Previous
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value='confirmation'>
                  <Card>
                    <CardHeader>
                      <CardTitle>Review Your Information</CardTitle>
                      <CardDescription>
                        Please verify your details before submitting
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div className='grid gap-4 md:grid-cols-2'>
                        <div className='space-y-1'>
                          <p className='text-sm font-medium'>
                            User Type
                          </p>
                          <p className='text-sm capitalize'>
                            {form.getValues('userType')}
                          </p>
                        </div>
                        <div className='space-y-1'>
                          <p className='text-sm font-medium'>Email</p>
                          <p className='text-sm'>
                            {form.getValues('email')}
                          </p>
                        </div>
                        <div className='space-y-1'>
                          <p className='text-sm font-medium'>
                            Full Name
                          </p>
                          <p className='text-sm'>
                            {form.getValues('fullName')}
                          </p>
                        </div>
                        <div className='space-y-1'>
                          <p className='text-sm font-medium'>
                            Gender
                          </p>
                          <p className='text-sm capitalize'>
                            {form.getValues('gender')}
                          </p>
                        </div>
                        <div className='space-y-1'>
                          <p className='text-sm font-medium'>
                            Date of Birth
                          </p>
                          <p className='text-sm'>
                            {form.getValues('dob')}
                          </p>
                        </div>
                        <div className='space-y-1'>
                          <p className='text-sm font-medium'>
                            Height
                          </p>
                          <p className='text-sm'>
                            {form.getValues('height')} cm
                          </p>
                        </div>
                        <div className='space-y-1'>
                          <p className='text-sm font-medium'>
                            Weight
                          </p>
                          <p className='text-sm'>
                            {form.getValues('weight')} kg
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className='flex items-center gap-4'>
                      <Button
                        type='submit'
                        className='w-32'
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting
                          ? 'Registering...'
                          : 'Register'}
                      </Button>
                      <Button
                        type='button'
                        variant='outline'
                        className='w-32'
                        onClick={() => setActiveTab('details')}
                      >
                        Previous
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </form>
            </Form>
          </Tabs>
        </div>
      </div>

      <div className='flex-1 hidden h-screen bg-gray-100 lg:block'>
        <img
          src='/images/doctor-looking-at-clipboard.jpg'
          alt='Registration illustration'
          className='object-cover object-top w-full h-full'
        />
      </div>
    </main>
  );
}
