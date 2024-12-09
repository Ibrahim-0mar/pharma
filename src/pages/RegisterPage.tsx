import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { UserIcon, Stethoscope } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";
import { Link, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "react-toastify";

export default function Component() {
  const [activeTab, setActiveTab] = useState("account");
  const [formValues, setFormValues] = useState({
    userType: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    gender: "",
    dob: "",
    height: "",
    weight: "",
  });
  const nav = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [id]: value }));
  };

  const handleTabChange = (tab: string) => {
    if (
      tab === "details" &&
      (!formValues.email || !formValues.password || !formValues.confirmPassword)
    ) {
      toast.error("Please fill out all required account fields.");
      return;
    }
    if (
      tab === "confirmation" &&
      (!formValues.fullName ||
        !formValues.gender ||
        !formValues.dob ||
        !formValues.height ||
        !formValues.weight)
    ) {
      toast.error("Please fill out all required details fields.");
      return;
    }
    setActiveTab(tab);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem("userData", JSON.stringify(formValues));
    nav("/dashboard/profile");
  };

  return (
    <main className="flex flex-col items-center justify-center lg:flex-row">
      <div className="flex items-center justify-center flex-1 min-h-screen">
        <div className="p-6 lg:p-10">
          <h1 className="mb-6 text-3xl font-bold">
            Register In Doctor's Prescription System
          </h1>
          <Tabs value={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="confirmation">Confirmation</TabsTrigger>
            </TabsList>
            <form onSubmit={handleSubmit}>
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                    <CardDescription>
                      Set up your account credentials
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-center space-x-4">
                        <div>
                          <Checkbox
                            id="pharmacist"
                            checked={formValues.userType === "pharmacist"}
                            onCheckedChange={() =>
                              setFormValues({
                                ...formValues,
                                userType: "pharmacist",
                              })
                            }
                            className="hidden"
                          />
                          <Label
                            htmlFor="pharmacist"
                            className={cn(
                              "flex items-center flex-col gap-4 text-2xl font-semibold border p-6 rounded-md",
                              {
                                "bg-primary text-background":
                                  formValues.userType === "pharmacist",
                              }
                            )}
                          >
                            <UserIcon className="w-16 h-16" />
                            <span>Pharmacist</span>
                          </Label>
                        </div>
                        {/* <div>
                          <Checkbox
                            id="doctor"
                            checked={formValues.userType === "doctor"}
                            onCheckedChange={() =>
                              setFormValues({
                                ...formValues,
                                userType: "doctor",
                              })
                            }
                            className="hidden"
                          />
                          <Label
                            htmlFor="doctor"
                            className={cn(
                              "flex items-center flex-col gap-4 text-2xl font-semibold border p-6 rounded-md",
                              {
                                "bg-primary text-background":
                                  formValues.userType === "doctor",
                              }
                            )}
                          >
                            <Stethoscope className="w-16 h-16" />
                            <span>Doctor</span>
                          </Label>
                        </div> */}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                        value={formValues.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={formValues.password}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        required
                        value={formValues.confirmPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start gap-4">
                    <Button
                      type="button"
                      className="w-32"
                      onClick={() => handleTabChange("details")}
                    >
                      Next
                    </Button>
                    <p>
                      Already have an account?{" "}
                      <Link to="/register" className="underline text-primary">
                        login
                      </Link>
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Details Information</CardTitle>
                    <CardDescription>Enter your details </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        required
                        value={formValues.fullName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={formValues.gender}
                        onValueChange={(value) =>
                          setFormValues({ ...formValues, gender: value })
                        }
                      >
                        <SelectTrigger id="gender" className="w-full">
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        required
                        value={formValues.dob}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (Cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        required
                        value={formValues.height}
                        onChange={handleInputChange}
                      />
                      <Label htmlFor="weight">Weight (Kg)</Label>
                      <div className="space-y-2">
                        <Input
                          id="weight"
                          type="number"
                          required
                          value={formValues.weight}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center gap-4">
                    <Button
                      type="button"
                      className="w-32"
                      onClick={() => handleTabChange("confirmation")}
                    >
                      Next
                    </Button>
                    <Button
                      type="button"
                      className="w-32"
                      variant={"outline"}
                      onClick={() => setActiveTab("account")}
                    >
                      Previous
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="confirmation">
                <Card>
                  <CardHeader>
                    <CardTitle>Confirmation</CardTitle>
                    <CardDescription>Review your information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-6">
                      {formValues.userType === "pharmacist" ? (
                        <div
                          className={cn(
                            "flex bg-primary text-background items-center flex-col gap-4 text-2xl font-semibold border p-6 rounded-md"
                          )}
                        >
                          <UserIcon className="w-16 h-16" />
                          <span>pharmacist</span>
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "flex items-center flex-col gap-4 bg-primary text-background text-2xl font-semibold border p-6 rounded-md"
                          )}
                        >
                          <Stethoscope className="w-16 h-16" />
                          <span>Doctor</span>
                        </div>
                      )}
                      <div>
                        <p>
                          <b>Full Name:</b> {formValues.fullName}
                        </p>
                        <p>
                          <b>Email:</b> {formValues.email}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <p>
                        <b>Gender:</b> {formValues.gender}
                      </p>
                      <p>
                        <b>Date of Birth:</b> {formValues.dob}
                      </p>
                      <p>
                        <b>Height:</b> {formValues.height} cm
                      </p>
                      <p>
                        <b>Weight:</b> {formValues.weight} kg
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center gap-4 ">
                    <Button type="submit" className="w-32">
                      Create Account
                    </Button>
                    <Button
                      type="button"
                      className="w-32"
                      variant={"outline"}
                      onClick={() => setActiveTab("details")}
                    >
                      Previous
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </form>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 hidden h-screen bg-gray-100 lg:block">
        <img
          src="/images/doctor-looking-at-clipboard.jpg"
          alt="Registration illustration"
          className="object-cover object-top w-full h-full"
        />
      </div>
    </main>
  );
}
