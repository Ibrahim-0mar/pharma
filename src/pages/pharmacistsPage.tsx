import { PlusIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

type pharmacist = {
  name: string;
  age: number;
  date: string;
  medications: string;
};

export default function PharmacistsPage() {
  const tempPharmacists: pharmacist[] = [
    {
      name: "Alice Johnson",
      age: 32,
      date: "2024-10-01",
      medications: "Paracetamol, Vitamin D",
    },
    {
      name: "Michael Smith",
      age: 47,
      date: "2024-10-05",
      medications: "Ibuprofen, Metformin",
    },
    {
      name: "Sarah Brown",
      age: 29,
      date: "2024-10-08",
      medications: "Amoxicillin, Aspirin",
    },
  ];

  const [pharmacists, setPharmacists] = useState<pharmacist[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newPharmacist, setNewPharmacist] = useState<pharmacist>({
    name: "",
    age: 0,
    date: "",
    medications: "",
  });
  const [pharmacistToDelete, setPharmacistToDelete] = useState<number | null>(
    null
  );
  useEffect(() => {
    const storedPharmacists = JSON.parse(
      localStorage.getItem("pharmacistsData") || "[]"
    );
    if (storedPharmacists.length === 0) {
      setPharmacists(tempPharmacists);
      localStorage.setItem("pharmacistsData", JSON.stringify(tempPharmacists));
    } else {
      setPharmacists(storedPharmacists);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("pharmacistsData", JSON.stringify(pharmacists));
  }, [pharmacists]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewPharmacist((prev) => ({
      ...prev,
      [id]: id === "age" ? Number(value) : value,
    }));
  };

  const addPharmacist = () => {
    setPharmacists((prevPharmacists) => [...prevPharmacists, newPharmacist]);
    setNewPharmacist({ name: "", age: 0, date: "", medications: "" });
    setIsDialogOpen(false);
  };

  const confirmDeletePharmacist = (index: number) => {
    setPharmacistToDelete(index);
    setIsDeleteDialogOpen(true);
  };

  const deletepharmacist = () => {
    if (pharmacistToDelete !== null) {
      setPharmacists((prevPharmacists) =>
        prevPharmacists.filter((_, idx) => idx !== pharmacistToDelete)
      );
      setPharmacistToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-3xl font-bold">pharmacists List</h1>
      <div className="overflow-hidden">
        <Table className="min-w-full bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-3 border">Name</TableHead>
              <TableHead className="px-4 py-3 border">Age</TableHead>
              <TableHead className="px-4 py-3 border">Date</TableHead>
              <TableHead className="px-4 py-3 border">Medications</TableHead>
              <TableHead className="px-4 py-3 border">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pharmacists.map((pharmacist, index) => (
              <TableRow key={index} className="hover:bg-gray-100">
                <TableCell className="px-4 py-3 border">
                  {pharmacist.name}
                </TableCell>
                <TableCell className="px-4 py-3 border">
                  {pharmacist.age}
                </TableCell>
                <TableCell className="px-4 py-3 border">
                  {pharmacist.date}
                </TableCell>
                <TableCell className="px-4 py-3 border">
                  {pharmacist.medications}
                </TableCell>
                <TableCell className="px-4 py-3 border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => confirmDeletePharmacist(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2 mt-4">
            <PlusIcon className="w-4 h-4" /> Add pharmacist
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New pharmacist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter name"
                value={newPharmacist.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter age"
                value={newPharmacist.age}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newPharmacist.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medications">Medications</Label>
              <Input
                id="medications"
                type="text"
                placeholder="Enter medications"
                value={newPharmacist.medications}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button
              className="block mx-auto mt-4 w-fit"
              size="lg"
              onClick={addPharmacist}
            >
              Add pharmacist
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this pharmacist?</p>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={deletepharmacist}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
