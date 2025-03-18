"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "@/lib/axios";
import { getCsrfToken } from "@/lib/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Loader2 } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    no_hp: "",
    password: "",
    password_confirmation: "",
    agreement: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.agreement) {
      setError("You must agree to the terms and conditions");
      setLoading(false);
      return;
    }

    try {
      // First, get the CSRF cookie
      await getCsrfToken();

      // Then make the registration request
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/register`,
        {
          name: formData.name,
          username: formData.username,
          email: formData.email,
          no_hp: formData.no_hp,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        }
      );

      // On success, redirect to login page
      if (response.data.status === "success") {
        router.push("/login?registered=true");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message ||
          (err.response?.data?.errors
            ? Object.values(err.response.data.errors).flat()[0]
            : "Failed to connect to server")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100 p-4">
      <div className="max-w-md w-full">
        <Card className="shadow-xl border-gray-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Create an account
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your details to register
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6 bg-gray-100 border-gray-800 text-gray-800">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    autoCapitalize="words"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="username" className="text-gray-700">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-gray-700">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="no_hp" className="text-gray-700">Phone Number</Label>
                  <Input
                    id="no_hp"
                    name="no_hp"
                    placeholder="Enter your phone number"
                    value={formData.no_hp}
                    onChange={handleInputChange}
                    required
                    className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password_confirmation" className="text-gray-700">
                    Confirm Password
                  </Label>
                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                    required
                    className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="agreement"
                    name="agreement"
                    checked={formData.agreement}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        agreement: checked === true,
                      }))
                    }
                    className="text-black focus:ring-gray-500"
                  />
                  <Label htmlFor="agreement" className="text-sm text-gray-700">
                    I agree to the Terms of Service and Privacy Policy
                  </Label>
                </div>

                <Button 
                  className="w-full bg-black hover:bg-gray-800 text-white" 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter>
            <div className="text-center text-sm w-full text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-gray-700 hover:text-gray-900"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
