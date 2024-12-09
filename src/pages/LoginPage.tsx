import { UserIcon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
import { cn } from "../lib/utils";

export default function LoginPage() {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    userType: "",
  });
  const nav = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [id]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formValues.email || !formValues.password || !formValues.userType) {
      toast.error("Please fill out all fields.");
      return;
    }
    localStorage.setItem("userData", JSON.stringify(formValues));
    nav("/dashboard");
  };

  return (
    <main className="flex flex-col items-center justify-center lg:flex-row">
      <div className="flex items-center justify-center flex-1 min-h-screen">
        <div className="p-6 lg:p-10">
          <h1 className="mb-6 text-3xl font-bold">
            Login to Doctor's Prescription System
          </h1>
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Select your user type and login</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit}>
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
                <div className="mt-4 space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formValues.password}
                    onChange={handleInputChange}
                  />
                </div>
                <CardFooter className="flex flex-col items-start gap-4 px-0 mx-0 mt-6">
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                  <p>
                    Don't have an account?{" "}
                    <Link to="/register" className="underline text-primary">
                      Register
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex-1 hidden h-screen bg-gray-100 lg:block">
        <img
          src="/images/doctor-looking-at-clipboard.jpg"
          alt="Login illustration"
          className="object-cover object-top w-full h-full"
        />
      </div>
    </main>
  );
}
