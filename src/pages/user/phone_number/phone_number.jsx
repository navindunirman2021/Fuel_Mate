import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import apiService from "@/services/api.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { alert } from "@/lib/alert";
import Loading from "@/components/loading";
import { ArrowLeft } from "lucide-react";

const phoneFormSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .regex(/^[0]\d{9}$/, "Please enter a valid phone number"),
});

export default function PhoneNumber() {
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const form = useForm({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const { mutate: updatePhoneNumber, isPending } = useMutation({
    mutationFn: (values) => apiService.post("/user/change-phone", {
      phoneNumber: values.phoneNumber,
    }),
    onSuccess: () => {
      navigate("/otp");
    },
    onError: (error) => {
      alert.error(error?.response?.data?.message || "Failed to update phone number");
    },
  });

  if (!isLoading && !user) {
    return <Navigate to="/login" />;
  }

  if (!isLoading && user.verified) {
    return <Navigate to="/dashboard" />;
  }

  return isLoading ? <Loading /> : (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center py-0 px-4">
      <div className="w-full max-w-xl bg-gray-800 rounded-xl p-10 shadow-2xl border border-gray-700 my-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-400 mb-4">
            Update Phone Number
          </h1>
          <p className="text-gray-300 text-lg">
            Please enter your new phone number to receive a verification code
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(updatePhoneNumber)} className="space-y-8">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-white text-lg">Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your phone number (e.g., 0771234567)"
                      {...field}
                      className="bg-gray-700 border-gray-600 text-white h-14 text-lg rounded-md"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-base" />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 text-lg font-medium rounded-md"
                loading={isPending}
              >
                Send Verification Code
              </Button>
            </div>
          </form>
        </Form>

        <div className="mt-8 flex justify-center">
          <Button
            variant="ghost"
            className="text-teal-400 hover:text-teal-300 hover:bg-gray-700 flex items-center gap-2 text-lg"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
