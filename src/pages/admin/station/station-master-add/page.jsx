import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, EyeIcon, EyeOffIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import apiService from "@/services/api.service";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const formSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),
    nic: z.string().min(2, "Name must be at least 2 characters"),
    // .regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function AddStationMaster() {
  const [showPasswords, setShowPasswords] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      nic: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending: isLoading } = useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Station Manager added successfully",
        variant: "default",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed",
        description: error.response.data.message,
        variant: "destructive",
      });
    },
    mutationFn: async (values) => {
      return await apiService.post("/admin/save", values);
    },
  });

  async function onSubmit(values) {
    const data = { ...values, role: "STATION_MANAGER" };
    mutate(data);
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-teal-400">Add Station Master</h1>
        <Link to="/admin/station-list">
          <Button className="bg-gray-700 hover:bg-gray-600 text-white flex items-center gap-2">
            <ArrowLeft size={18} />
            Back to List
          </Button>
        </Link>
      </div>
      <Card className="bg-gray-800 border-gray-700 shadow-lg p-8 max-w-xl w-full">
        <CardContent className="p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-white font-medium">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} 
                        className="bg-gray-700 border-gray-600 text-white p-3 text-base focus-visible:ring-teal-500 h-12" />
                    </FormControl>
                    <FormMessage className="text-red-400 text-base" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-white font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                        className="bg-gray-700 border-gray-600 text-white p-3 text-base focus-visible:ring-teal-500 h-12"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-base" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-white font-medium">NIC</FormLabel>
                    <FormControl>
                      <Input placeholder="123456789v" {...field} 
                        className="bg-gray-700 border-gray-600 text-white p-3 text-base focus-visible:ring-teal-500 h-12" />
                    </FormControl>
                    <FormMessage className="text-red-400 text-base" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-white font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPasswords ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pr-10 bg-gray-700 border-gray-600 text-white p-3 text-base focus-visible:ring-teal-500 h-12"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(!showPasswords)}
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
                    <FormMessage className="text-red-400 text-base" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-white font-medium">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPasswords ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="pr-10 bg-gray-700 border-gray-600 text-white p-3 text-base focus-visible:ring-teal-500 h-12"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(!showPasswords)}
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
                    <FormMessage className="text-red-400 text-base" />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full py-6 text-lg bg-teal-600 hover:bg-teal-700 mt-8" loading={isLoading}>
                Add Station Master
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
