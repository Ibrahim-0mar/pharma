import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { getPrescriptionsFromDB } from "../lib/utils";

type pharmacist = {
  name: string;
  age: number;
  date: string;
  medications: string;
};
type Prescription = {
  date: string;
  medications: string[];
  image: string;
};

export default function PharmacistOverview() {
  const [pharmacists, setPharmacists] = useState<pharmacist[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
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
    {
      name: "David Williams",
      age: 54,
      date: "2024-10-10",
      medications: "Lisinopril, Levothyroxine",
    },
    {
      name: "Emily Davis",
      age: 43,
      date: "2024-10-15",
      medications: "Omeprazole, Losartan",
    },
  ];
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
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  useEffect(() => {
    const fetchPrescriptions = async () => {
      const storedPrescriptions = await getPrescriptionsFromDB();
      setPrescriptions(storedPrescriptions);
    };
    fetchPrescriptions();
  }, []);

  return (
    <div className="p-6">
      {user.userType === "doctor" ? (
        <>
          <h1 className="mb-6 text-3xl font-bold text-center">
            Latest pharmacists
          </h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pharmacists.length > 0 ? (
              pharmacists.slice(0, 6).map((pharmacist, index) => (
                <Card
                  key={index}
                  className="transition-shadow duration-300 shadow-lg hover:shadow-xl"
                >
                  <CardHeader>
                    <CardTitle>{pharmacist.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <b>Age:</b> {pharmacist.age}
                    </p>
                    <p>
                      <b>Date Added:</b> {pharmacist.date}
                    </p>
                    <p>
                      <b>Medications:</b> {pharmacist.medications}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center col-span-full">No pharmacists found.</p>
            )}
          </div>
        </>
      ) : (
        <>
          <h1 className="mb-4 text-3xl font-bold">Prescriptions Overview</h1>

          <div className="grid gap-6 mb-6 md:grid-cols-2 lg:grid-cols-3">
            {prescriptions.slice(-3).map((prescription, index) => (
              <Card
                key={index}
                className="transition-shadow duration-300 shadow-lg hover:shadow-xl"
              >
                <CardHeader>
                  <CardTitle>
                    Prescription {prescriptions.length - index}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    <b>Date:</b> {prescription.date}
                  </p>
                  <p>
                    <b>Medications:</b> {prescription.medications.join(", ")}
                  </p>
                  {prescription.image && (
                    <img
                      src={prescription.image}
                      alt="Prescription"
                      className="object-cover w-full h-32 mt-4 rounded"
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
