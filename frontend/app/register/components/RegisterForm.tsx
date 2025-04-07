"use client";

import Link from "next/link";
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
import { AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { RegisterFormData } from "../types";

interface RegisterFormProps {
  formData: RegisterFormData;
  error: string;
  loading: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  togglePasswordVisibility: () => void;
  toggleConfirmPasswordVisibility: () => void;
  handleCheckboxChange: (checked: boolean) => void;
}

export function RegisterForm({
  formData,
  error,
  loading,
  showPassword,
  showConfirmPassword,
  handleInputChange,
  handleSubmit,
  togglePasswordVisibility,
  toggleConfirmPasswordVisibility,
  handleCheckboxChange,
}: RegisterFormProps) {
  return (
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

            {/* Added Date of Birth field */}
            <div className="grid gap-2">
              <Label htmlFor="tanggal_lahir" className="text-gray-700">Date of Birth</Label>
              <Input
                id="tanggal_lahir"
                name="tanggal_lahir"
                type="date"
                value={formData.tanggal_lahir}
                onChange={handleInputChange}
                required
                className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password_confirmation" className="text-gray-700">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={toggleConfirmPasswordVisibility}
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="agreement"
                name="agreement"
                checked={formData.agreement}
                onCheckedChange={handleCheckboxChange}
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
  );
}
