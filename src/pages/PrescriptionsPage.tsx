/**
 * @file Prescriptions Page Component
 * @module pages/PrescriptionsPage
 * @description Handles prescription management, including adding new prescriptions,
 * image processing, and displaying existing prescriptions
 */

import customAxios from '@/lib/axios/axios.config';
import { MEDICATION_OPTIONS } from '@/lib/constants/medications';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, PlusIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { getCroppedImage } from '../lib/imageUtils';
import {
  prescriptionSchema,
  type PrescriptionFormValues,
} from '../lib/schemas/prescription.schema';

/**
 * Extended Area interface for image cropping
 * @interface
 * @extends Area
 */
interface CropArea extends Area {
  width: number;
  height: number;
}

/**
 * Prescriptions management component
 * @component
 * @description Handles prescription management with image upload and cropping functionality
 */
export default function PrescriptionsPage() {
  // State management
  const [prescriptions, setPrescriptions] = useState<PrescriptionFormValues[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [isTableLoading, setIsTableLoading] = useState(false);

  // Form initialization
  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      medications: [],
      image: '',
      name: '',
      dosage: '',
      frequency: ''
    },
  });

  /**
   * Fetches all prescriptions on component mount
   */
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setIsTableLoading(true);
        const { data } = await customAxios.get('/GetAllPrescription');
        setPrescriptions(data);
      } catch (error) {
        console.error('[PrescriptionsPage] Error fetching prescriptions:', error);
        toast.error('Error loading prescriptions');
      } finally {
        setIsTableLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  /**
   * Handles image file selection and preview
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSource(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  /**
   * Handles crop completion
   * @param {Area} croppedArea - Cropped area dimensions
   * @param {CropArea} croppedAreaPixels - Cropped area in pixels
   */
  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: CropArea) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  /**
   * Assigns random medications to the prescription
   */
  const assignRandomMedications = useCallback(() => {
    const randomMeds = new Set<string>();
    while (randomMeds.size < 5) {
      const randomIndex = Math.floor(Math.random() * MEDICATION_OPTIONS.length);
      randomMeds.add(MEDICATION_OPTIONS[randomIndex]);
    }
    form.setValue('medications', Array.from(randomMeds));
  }, [form.setValue]);

  /**
   * Simulates loading state for medication assignment
   */
  const simulateLoading = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      assignRandomMedications();
      setIsLoading(false);
    }, 3000);
  }, [assignRandomMedications]);

  /**
   * Confirms and processes the cropped image
   */
  const confirmCrop = useCallback(async () => {
    if (!imageSource || !croppedAreaPixels) return;

    try {
      const cropped = await getCroppedImage(imageSource, croppedAreaPixels);
      form.setValue('image', cropped);
      setIsCropping(false);
      simulateLoading();
    } catch (error) {
      console.error('[PrescriptionsPage] Error cropping image:', error);
      toast.error('Error processing image');
    }
  }, [imageSource, croppedAreaPixels, form.setValue, simulateLoading]);

  /**
   * Handles form submission
   * @param {PrescriptionFormValues} values - Form values
   */
  const onSubmit = async (values: PrescriptionFormValues) => {
    try {
      setIsLoading(true);
      const { data } = await customAxios.post('/AddNewPresc', values);
      setPrescriptions((prev) => [...prev, data]);
      form.reset();
      setIsDialogOpen(false);
      toast.success('Prescription added successfully!');
    } catch (error) {
      console.error('[PrescriptionsPage] Error adding prescription:', error);
      toast.error('Error adding prescription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-semibold mb-4'>All Prescriptions</h2>
      <div className='overflow-hidden'>
        <Table className='min-w-full bg-white'>
          <TableHeader>
            <TableRow>
              <TableHead className='py-3 px-4 border'>Date</TableHead>
              <TableHead className='py-3 px-4 border'>
                Medications
              </TableHead>
              <TableHead className='py-3 px-4 border'>Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isTableLoading ? (
              <TableRow>
                <TableCell 
                  colSpan={3} 
                  className='text-center py-8'
                >
                  <Loader2 className='animate-spin w-6 h-6 mx-auto text-gray-600' />
                </TableCell>
              </TableRow>
            ) : prescriptions.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={3} 
                  className='text-center py-8 text-gray-500'
                >
                  No prescriptions found
                </TableCell>
              </TableRow>
            ) : (
              prescriptions.map((prescription, index) => (
                <TableRow
                  key={index}
                  className='hover:bg-gray-100'
                >
                  <TableCell className='py-3 px-4 border'>
                    {prescription.date}
                  </TableCell>
                  <TableCell className='py-3 px-4 border'>
                    {prescription.medications.join(', ')}
                  </TableCell>
                  <TableCell className='py-3 px-4 border'>
                    {prescription.image && (
                      <img
                        src={prescription.image}
                        alt='Prescription'
                        className='w-16 h-16 object-cover rounded'
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <DialogTrigger asChild>
          <Button className='mt-4 flex items-center gap-2'>
            <PlusIcon className='w-4 h-4' /> Add Prescription
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Prescription</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='image'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prescription Image</FormLabel>
                    <FormControl>
                      <div className='space-y-4'>
                        <Input
                          type='file'
                          accept='image/*'
                          onChange={handleImageChange}
                          disabled={isLoading}
                        />
                        {isCropping && imageSource && (
                          <div className='relative h-64 w-full bg-gray-200'>
                            <Cropper
                              image={imageSource}
                              crop={crop}
                              zoom={zoom}
                              onCropChange={setCrop}
                              onZoomChange={setZoom}
                              onCropComplete={onCropComplete}
                            />
                            <Button
                              onClick={confirmCrop}
                              className='absolute bottom-4 left-1/2 transform -translate-x-1/2'
                              disabled={isLoading}
                            >
                              Confirm Crop
                            </Button>
                          </div>
                        )}
                        {field.value && !isLoading && !isCropping && (
                          <img
                            src={field.value}
                            alt='Prescription Preview'
                            className='mt-2 w-full object-cover rounded'
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prescription Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='dosage'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dosage</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='frequency'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isLoading && (
                <div className='flex justify-center'>
                  <Loader2 className='animate-spin w-6 h-6 text-gray-600' />
                </div>
              )}

              <Button
                type='submit'
                className='w-full'
                disabled={isLoading || !form.formState.isValid}
              >
                {isLoading ? 'Processing...' : 'Add Prescription'}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
