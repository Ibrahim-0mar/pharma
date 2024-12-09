/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect, useCallback } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { PlusIcon, Loader2 } from "lucide-react";
import Cropper from "react-easy-crop";
import { addPrescriptionToDB, getPrescriptionsFromDB } from "../lib/utils";
import { getCroppedImage } from "../lib/imageUtils";
type Prescription = {
  date: string;
  medications: string[];
  image: string;
};

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newPrescription, setNewPrescription] = useState<Prescription>({
    date: new Date().toISOString().split("T")[0],
    medications: [],
    image: "",
  });
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [imageSource, setImageSource] = useState<string | null>(null);

  const medicationOptions = [
    "Ibuprofen",
    "Aspirin",
    "Paracetamol",
    "Amoxicillin",
    "Metformin",
    "Omeprazole",
    "Lipitor",
    "Lisinopril",
    "Levothyroxine",
    "Azithromycin",
    "Albuterol",
    "Ciprofloxacin",
    "Losartan",
    "Atorvastatin",
    "Gabapentin",
    "Prednisone",
    "Hydrochlorothiazide",
    "Zoloft",
    "Sertraline",
    "Xanax",
  ];

  useEffect(() => {
    const fetchPrescriptions = async () => {
      const storedPrescriptions = await getPrescriptionsFromDB();
      setPrescriptions(storedPrescriptions);
    };
    fetchPrescriptions();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSource(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // @ts-ignore
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const confirmCrop = useCallback(async () => {
    if (imageSource && croppedAreaPixels) {
      try {
        const cropped = await getCroppedImage(imageSource, croppedAreaPixels);
        setCroppedImage(cropped);
        setNewPrescription((prev) => ({
          ...prev,
          image: cropped,
        }));
        setIsCropping(false);
        simulateLoading();
      } catch (error) {
        console.error("Error cropping image:", error);
      }
    }
  }, [imageSource, croppedAreaPixels]);

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      assignRandomMedications();
      setIsLoading(false);
    }, 3000);
  };

  const assignRandomMedications = () => {
    const randomMeds = new Set<string>();
    while (randomMeds.size < 5) {
      const randomIndex = Math.floor(Math.random() * medicationOptions.length);
      randomMeds.add(medicationOptions[randomIndex]);
    }
    setNewPrescription((prev) => ({
      ...prev,
      medications: Array.from(randomMeds),
    }));
  };

  const addPrescription = async () => {
    // @ts-ignore
    await addPrescriptionToDB(newPrescription);
    setPrescriptions((prev) => [...prev, newPrescription]);
    setNewPrescription({
      date: new Date().toISOString().split("T")[0],
      medications: [],
      image: "",
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">All Prescriptions</h2>
      <div className="overflow-hidden">
        <Table className="min-w-full bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="py-3 px-4 border">Date</TableHead>
              <TableHead className="py-3 px-4 border">Medications</TableHead>
              <TableHead className="py-3 px-4 border">Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prescriptions.map((prescription, index) => (
              <TableRow key={index} className="hover:bg-gray-100">
                <TableCell className="py-3 px-4 border">
                  {prescription.date}
                </TableCell>
                <TableCell className="py-3 px-4 border">
                  {prescription.medications.join(", ")}
                </TableCell>
                <TableCell className="py-3 px-4 border">
                  {prescription.image && (
                    <img
                      src={prescription.image}
                      alt="Prescription"
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog for adding new prescription */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mt-4 flex items-center gap-2">
            <PlusIcon className="w-4 h-4" /> Add Prescription
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Prescription</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image">Prescription Image</Label>
              <div className="flex gap-2">
                <Input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </div>
              {isCropping && imageSource && (
                <div className="relative h-64 w-full bg-gray-200">
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
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                  >
                    Confirm Crop
                  </Button>
                </div>
              )}
              {croppedImage && !isLoading && (
                <img
                  src={croppedImage}
                  alt="Prescription Preview"
                  className="mt-2 w-full object-cover rounded"
                />
              )}
              {isLoading && (
                <Loader2 className="animate-spin w-6 h-6 mx-auto text-gray-600 mt-4" />
              )}
            </div>
            <Button
              className="mt-4 w-fit mx-auto block"
              size="lg"
              onClick={addPrescription}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Add Prescription"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
