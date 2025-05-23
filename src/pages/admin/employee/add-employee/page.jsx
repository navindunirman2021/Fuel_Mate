import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import apiService from '@/services/api.service';
import { useMutation } from '@tanstack/react-query';
import { alert } from '@/lib/alert';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^(?:\+94|0)?[0-9]{9}$/, "Invalid phone number format"),
  nic: z.string().regex(/^([0-9]{9}[x|X|v|V]|[0-9]{12})$/, "Invalid NIC format"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase and numbers"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const AddEmployee = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      nic: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: addEmployee, isPending } = useMutation({
    mutationFn: async (data) => {
      const response = await apiService.post("/employee/save", data);
      return response.data.data;
    },
    onSuccess: () => {
      alert.success("Employee added successfully");
      form.reset();
    },
    onError: (error) => {
      alert.error(error.response.data.data.message);
    },
  });

  function onSubmit(values) {
    addEmployee(values);
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-teal-400">Add New Employee</h1>
        <Link to="/admin/employee-list">
          <Button className="bg-gray-700 hover:bg-gray-600 text-white flex items-center gap-2">
            <ArrowLeft size={18} />
            Back to List
          </Button>
        </Link>
      </div>

      <Card className="bg-gray-800 border-gray-700 shadow-lg p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-white font-medium">Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter employee name" 
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-white font-medium">Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter phone number" 
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
                  <FormLabel className="text-lg text-white font-medium">NIC Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter NIC number" 
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-white font-medium">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        {...field}
                        className="bg-gray-700 border-gray-600 text-white p-3 text-base focus-visible:ring-teal-500 h-12 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
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
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        {...field}
                        className="bg-gray-700 border-gray-600 text-white p-3 text-base focus-visible:ring-teal-500 h-12 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-base" />
                </FormItem>
              )}
            />

            <Button 
              loading={isPending} 
              type="submit" 
              className="w-full py-6 text-lg bg-teal-600 hover:bg-teal-700 mt-8"
            >
              Add Employee
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AddEmployee; 