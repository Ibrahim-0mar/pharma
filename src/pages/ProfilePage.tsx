/**
 * @file Profile Page Component
 * @module pages/ProfilePage
 * @description Handles user profile management
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
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
import customAxios from '../lib/axios/axios.config';
import {
  profileSchema,
  type ProfileFormValues,
} from '../lib/schemas/profile.schema';

/**
 * Profile management component
 * @component
 */
export default function ProfilePage() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      userType: 'pharmacist',
      email: '',
      fullName: '',
      gender: 'male',
      dob: '',
      height: '',
      weight: '',
    },
  });

  /**
   * Load user data on component mount
   */
  useEffect(() => {
    // TODO: replace this with API call to get user data
    const loadUserData = () => {
      try {
        const storedData = JSON.parse(
          localStorage.getItem('userData') || '{}'
        );
        if (Object.keys(storedData).length) {
          form.reset(storedData);
        }
      } catch (error) {
        console.error(
          '[ProfilePage] Error loading user data:',
          error
        );
        toast.error('Error loading profile data');
      }
    };

    loadUserData();
  }, [form]);

  /**
   * Handle form submission
   * @async
   * @param {ProfileFormValues} values - Form values
   */
  const onSubmit = async (values: ProfileFormValues) => {
    try {
      // TODO: remove this after testing
      localStorage.setItem('userData', JSON.stringify(values));

      // Make API call to update profile
      const { data } = await customAxios.put('/UpdatePharmacist', {
        email: values.email,
        fullName: values.fullName,
        height: values.height,
        weight: values.weight,
        gender: values.gender,
        birthOfDate: values.dob,
      });

      // TODO: check backend response and show toast message based on that
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('[ProfilePage] Error updating profile:', error);
      toast.error(error.message || 'Error updating profile');
    }
  };

  return (
    <Card className='max-w-full shadow-none border-none w-full'>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
              name='gender'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select gender' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='male'>Male</SelectItem>
                      <SelectItem value='female'>Female</SelectItem>
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
          <CardFooter className='flex justify-end'>
            <Button
              type='submit'
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? 'Saving...'
                : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
