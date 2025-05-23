import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import apiService from "@/services/api.service";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  vehicleType: z.string().min(2, "Vehicle type must be at least 2 characters"),
  fuelType: z.string().min(1, "Please select a fuel type"),
  defaultQuota: z.coerce.number().min(1, "Default quota must be greater than 0"),
});

const AddVehicleTypes = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleType: "",
      fuelType: "PETROL",
      defaultQuota: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await apiService.post("/vehicle-types/add", {
        vehicleType: data.vehicleType,
        fuelType: data.fuelType.toUpperCase(),
        defaultQuota: parseInt(data.defaultQuota),
      });

      if (response.data.status !== 200) {
        throw new Error(response.data.message);
      }

      form.reset();
      toast({
        title: "Success",
        description: "Vehicle type added successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Failed to add vehicle type",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-teal-400">Add Vehicle Type</h1>
        <Link to="/admin/vehicle-type-list">
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
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-white font-medium">Vehicle Type</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter vehicle type" 
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
              name="fuelType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-white font-medium">Fuel Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white p-3 h-12 focus:ring-teal-500">
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="PETROL" className="hover:bg-gray-700 focus:bg-gray-700 text-base">Petrol</SelectItem>
                      <SelectItem value="DIESEL" className="hover:bg-gray-700 focus:bg-gray-700 text-base">Diesel</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400 text-base" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultQuota"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-white font-medium">Default Quota</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter default quota" 
                      {...field} 
                      className="bg-gray-700 border-gray-600 text-white p-3 text-base focus-visible:ring-teal-500 h-12"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-base" />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full py-6 text-lg bg-teal-600 hover:bg-teal-700 mt-8"
            >
              {isLoading ? "Adding..." : "Add Vehicle Type"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AddVehicleTypes;
