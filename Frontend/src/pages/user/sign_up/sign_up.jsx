import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { showToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import apiService from "@/services/api.service";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Loading from "@/components/loading";
import { useQuery } from "@tanstack/react-query";

const signUpFormSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
    nic: z.string().min(5, "NIC is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
    terms: z.literal(true, {
      errorMap: () => ({
        message: "You must agree to the Terms and Conditions",
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SignUpPage() {
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { data: allData, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await apiService.get("/user/authenticate");
      return response.data.data;
    },
    retry: false,
  });

  const user = allData?.user;

  const form = useForm({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      nic: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  async function onSubmit(values) {
    setLoading(true);
    try {
      const data = {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phoneNumber,
        nic: values.nic,
        password: values.password,
      };
      const response = await apiService.post("/user/save", data);

      if (response.status === 200) {
        localStorage.setItem("token", response?.data?.data?.token);
        showToast.success("Account created successfully!");
      } else {
        showToast.error(
          response.data.message || "Something went wrong. Please try again."
        );
      }

      form.reset({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        nic: "",
        password: "",
        confirmPassword: "",
        terms: false,
      });

      navigate("/otp");
    } catch (error) {
      showToast.error(
        error.response.data.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPasswords((prev) => !prev);
  };

  if (!isLoading && user) {
    return <Navigate to="/dashboard" />;
  }

  return isLoading ? <Loading /> : (
    <div className="bg-gray-900 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <Card className="bg-gray-800 text-white border-gray-700">
              <CardHeader>
                <h2 className="text-2xl font-bold text-teal-400">
                  Unlock Your Potential
                </h2>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="First Name" className="bg-gray-700 border-gray-600 text-white" {...field} />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Last Name" className="bg-gray-700 border-gray-600 text-white" {...field} />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Phone Number" className="bg-gray-700 border-gray-600 text-white" {...field} />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nic"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">NIC</FormLabel>
                            <FormControl>
                              <Input placeholder="NIC" className="bg-gray-700 border-gray-600 text-white" {...field} />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPasswords ? "text" : "password"}
                                  placeholder="Enter your password"
                                  className="pr-10 bg-gray-700 border-gray-600 text-white"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  onClick={togglePasswordVisibility}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                >
                                  {showPasswords ? (
                                    <EyeOffIcon className="h-5 w-5" />
                                  ) : (
                                    <EyeIcon className="h-5 w-5" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPasswords ? "text" : "password"}
                                  placeholder="Confirm password"
                                  className="pr-10 bg-gray-700 border-gray-600 text-white"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  onClick={togglePasswordVisibility}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                >
                                  {showPasswords ? (
                                    <EyeOffIcon className="h-5 w-5" />
                                  ) : (
                                    <EyeIcon className="h-5 w-5" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="terms"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormControl>
                              <input
                                type="checkbox"
                                id="terms-checkbox"
                                {...field}
                                className="h-4 w-4 text-teal-500 focus:ring-teal-500 border-gray-600 rounded bg-gray-700"
                              />
                            </FormControl>
                            <label
                              htmlFor="terms-checkbox"
                              className="ml-2 block text-sm text-gray-300 cursor-pointer"
                              onClick={() =>
                                form.setValue("terms", !field.value)
                              }
                            >
                              I agree to{" "}
                              <a
                                href="#"
                                className="text-teal-400 underline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                Terms and Conditions
                              </a>
                            </label>
                          </div>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <div className="mt-6">
                      <Button
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                        loading={loading}
                      >
                        Sign Up
                      </Button>
                    </div>

                    <p className="mt-4 text-sm text-center text-gray-300">
                      Already have an account?{" "}
                      <Link to="/login" className="text-teal-400 underline">
                        Sign In
                      </Link>
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
