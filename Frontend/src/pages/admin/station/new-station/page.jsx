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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiService from "@/services/api.service";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const formSchema = z.object({
  regNo: z
    .string()
    .min(2, "Registration number must be at least 2 characters.")
    .regex(
      /^[A-Za-z0-9-]+$/,
      "Registration number can only contain letters, numbers, and hyphens"
    ),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  ownerId: z.number({
    required_error: "Please select an owner.",
    invalid_type_error: "Please select an owner.",
  }).positive("Please select an owner."),
});

const NewStation = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      regNo: "",
      location: "",
      ownerId: 0,
      employeeCount: "",
    },
  });

  const { data: managers, isLoading: isLoadingManagers, refetch, error: errorManagers } = useQuery({
    queryKey: ["unassigned-station-managers"],
    queryFn: () => apiService.get("/admin/unassigned-station-managers"),
  });

  const { mutate, isPending: isLoading } = useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Station added successfully",
        variant: "default",
      });
      refetch();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed",
        description: error.response.data.message,
        variant: "destructive",
      });
    },
    mutationFn: async (values) => { return await apiService.post("/fuelstation/save", values) },
  });

  const onSubmit = async (values) => {
    mutate(values);
  }

  const owners = errorManagers ? [] : managers?.data?.data?.map((manager) => ({
    id: manager.id,
    name: manager.name,
  })) || [];

  const handleOwnerChange = (value) => {
    form.setValue("ownerId", parseInt(value));
    form.trigger("ownerId");
  };


  return (
    <div className="max-w-[1000px] mx-auto space-y-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-teal-400">Add New Station</h1>
        <Link to="/admin/station-list">
          <Button className="bg-gray-700 hover:bg-gray-600 text-white flex items-center gap-2">
            <ArrowLeft size={18} />
            Back to List
          </Button>
        </Link>
      </div>
      <Card className="bg-gray-800 border-gray-700 shadow-lg p-8 max-w-xl w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="regNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-white font-medium">Registration Number</FormLabel>
                  <FormControl>
                    <Input placeholder="FS33234" {...field} 
                      className="bg-gray-700 border-gray-600 text-white p-3 text-base focus-visible:ring-teal-500 h-12" />
                  </FormControl>
                  <FormMessage className="text-red-400 text-base" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-white font-medium">Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Athurugiriya" {...field} 
                      className="bg-gray-700 border-gray-600 text-white p-3 text-base focus-visible:ring-teal-500 h-12" />
                  </FormControl>
                  <FormMessage className="text-red-400 text-base" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ownerId"
              render={() => (
                <FormItem>
                  <FormLabel className="text-lg text-white font-medium">Owner</FormLabel>
                  <Select
                    onValueChange={handleOwnerChange}
                    disabled={owners.length === 0}
                    value={errorManagers ? 0 : form.getValues("ownerId")}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white p-3 h-12 focus:ring-teal-500">
                        {owners.length === 0 && "No Active Station Managers"}
                        <SelectValue value={0} placeholder={"Select an owner"} />
                      </SelectTrigger>
                    </FormControl>
                    {(!isLoadingManagers || owners.length > 0) ? <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {owners.map((manager) => (
                        <SelectItem key={manager.id} value={manager.id} className="hover:bg-gray-700 focus:bg-gray-700 text-base">
                          {manager.name}
                        </SelectItem>
                      ))}
                    </SelectContent> : <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem key={0} value="0" className="hover:bg-gray-700 focus:bg-gray-700 text-base">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </SelectItem>
                    </SelectContent>}
                  </Select>
                  <FormMessage className="text-red-400 text-base" />
                </FormItem>
              )}
            />

            <Button type="submit" loading={isLoading} 
              className="w-full py-6 text-lg bg-teal-600 hover:bg-teal-700 mt-8">
              Create Station
            </Button>
          </form>
        </Form>
      </Card>
    </div >
  );
};
export default NewStation;
