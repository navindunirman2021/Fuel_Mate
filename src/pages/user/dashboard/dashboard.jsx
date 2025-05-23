import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/hooks/use-toast";
import apiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Navigate, useNavigate } from "react-router-dom";
import Loading from "@/components/loading";

const vehicleSchema = z.object({
  vehicleNumber: z.object({
    prefix: z
      .string()
      .min(1, "Prefix is required")
      .regex(/^[A-Z]+$/, "Prefix must be uppercase letters only"),
    number: z.string().min(1, "Number is required"),
  }),
  vehicleType: z.number({
    required_error: "Vehicle type is required",
    invalid_type_error: "Vehicle type must be a number",
  }).min(1, "Vehicle type is required"),
  chassisNumber: z
    .string()
    .min(1, "Chassis number is required")
    .regex(
      /^[A-Z0-9]+$/,
      "Chassis number must be uppercase letters and numbers only"
    ),
  fuelType: z.enum(["PETROL", "DIESEL"], {
    required_error: "Please select a fuel type",
  }),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
});

const Dashboard = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
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

  const { data: vehicleTypesData, isLoading: isLoadingVehicleTypes, error: vehicleTypesError } = useQuery({
    queryKey: ["vehicleTypes"],
    queryFn: async () => {
      const response = await apiService.get("/vehicle-types/view");
      if (!response.data.data) {
        throw new Error("No vehicle types found");
      }
      return response.data.data;
    },
  });

  const vehicleTypes = vehicleTypesData || [];

  const groupedVehicles = Object.values(
    vehicleTypes.reduce((acc, { vehicleType, fuelType, defaultQuota, id }) => {
      if (!acc[vehicleType]) {
        acc[vehicleType] = { vehicleType, fuelTypes: [], defaultQuota, id };
      }
      if (!acc[vehicleType].fuelTypes.includes(fuelType)) {
        acc[vehicleType].fuelTypes.push(fuelType);
      }
      return acc;
    }, {})
  );

  const form = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      termsAccepted: false
    },
  });

  const handleUpperCase = (e, field) => {
    const value = e.target.value.toUpperCase();
    form.setValue(field, value);
  };

  const selectedFuelType = form.watch("fuelType");

  const getCurrentVehicleType = () => {
    if (!form.getValues("vehicleType")) {
      return null;
    }
    const tempVehicleType = vehicleTypes.find(type => type.id === form.getValues("vehicleType"));
    const currentVehicleType = vehicleTypes.find(type => type.fuelType === form.getValues("fuelType").toUpperCase() && type.vehicleType === tempVehicleType.vehicleType);
    return currentVehicleType;
  }

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const vehicleData = {
        userId: userInfo?.id,
        vehicleType: getCurrentVehicleType().id,
        vehicleRegistrationPart1: data.vehicleNumber.prefix,
        vehicleRegistrationPart2: data.vehicleNumber.number,
        chassisNumber: data.chassisNumber,
        fuelType: data.fuelType.toUpperCase(),
      };

      const response = await apiService.post("/vehicle/save", vehicleData);

      if (response.status === 200) {
        showToast.success("Vehicle registered successfully!");
        setShowSuccessModal(true);
        form.reset();
      }
    } catch (error) {
      if (error.response) {
        showToast.error(error.response.data?.message || "Failed to register vehicle");
      } else if (error.request) {
        showToast.error("Server not responding. Please try again later.");
      } else {
        showToast.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await apiService.get("/user/authenticate");
        if (response.status === 200) {
          setUserInfo(response.data.data.user);
        }
      } catch (error) {
        if (error.response) {
          showToast.error(error.response.data?.message || "Failed to fetch user info");
        } else if (error.request) {
          showToast.error("Server not responding. Please try again later.");
        } else {
          showToast.error("An error occurred. Please try again.");
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleVehicleTypeChange = (value) => {
    form.setValue("vehicleType", parseInt(value));
    form.setValue("fuelType", undefined);
    const selectedVehicleType = groupedVehicles.find(type => type.id === parseInt(value));
    if (selectedVehicleType) {
      form.setValue("availableFuelTypes", selectedVehicleType.fuelTypes);
      form.setValue("fuelType", selectedVehicleType.fuelTypes[0]);
    }
  }

  if (!isLoading && !user) {
    return <Navigate to="/login" />;
  }
  if (!isLoading && !user.verified) {
    return <Navigate to="/otp" />;
  }
  if (!isLoading && user.verified && allData.vehicleRegistration) {
    return <Navigate to="/dashboard" />;
  }

  return isLoading ? <Loading /> : (
    <div className="bg-gray-900 min-h-screen py-10">
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-sm mx-4 text-white">
            <div className="text-center">
              <div className="text-teal-400 text-5xl mb-5">✓</div>
              <h3 className="text-2xl font-medium mb-5">Success!</h3>
              <p className="text-lg text-gray-300 mb-6">
                Vehicle has been registered successfully.
              </p>
              <button
                onClick={() => { setShowSuccessModal(false); navigate('/dashboard') }}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded text-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-teal-400 mb-10 text-center">Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Information Card */}
          <div className="bg-gray-800 rounded-lg p-8 shadow-lg text-white">
            <h2 className="text-teal-400 text-2xl font-bold text-center mb-8 border-b border-gray-700 pb-4">Your Information</h2>
            <div className="space-y-6">
              {userInfo ? (
                <>
                  <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                    <span className="text-gray-300 font-medium text-lg">Name:</span>
                    <span className="text-white font-semibold text-lg">{userInfo.firstName} {userInfo.lastName}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                    <span className="text-gray-300 font-medium text-lg">NIC:</span>
                    <span className="text-white font-semibold text-lg">{userInfo.nic}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-medium text-lg">Phone:</span>
                    <span className="text-white font-semibold text-lg">{userInfo.phone}</span>
                  </div>
                </>
              ) : (
                <Loading />
              )}
            </div>

            {/* QR Code Placeholder Section */}
            <div className="mt-10 flex flex-col items-center">
              <h3 className="text-teal-400 font-semibold text-xl mb-5">Your QR Code</h3>
              <div className="p-4 bg-white rounded-lg h-[180px] w-[180px] flex items-center justify-center">
                <div className="text-gray-800 text-base">QR Code will be displayed here after registration</div>
              </div>
              <p className="text-base text-gray-400 mt-4 text-center">
                Present this QR code at the fuel station for fuel quota access
              </p>
            </div>
          </div>

          {/* Vehicle Registration Form */}
          <div className="bg-gray-800 rounded-lg p-8 shadow-lg text-white">
            <h2 className="text-teal-400 text-2xl font-bold text-center mb-8 border-b border-gray-700 pb-4">Vehicle Registration</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block mb-2 font-medium text-gray-200">Vehicle Number</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ex: ABC"
                      className="border border-gray-600 bg-gray-700 rounded p-2 w-1/3 text-white uppercase"
                      {...form.register("vehicleNumber.prefix")}
                      onChange={(e) => handleUpperCase(e, "vehicleNumber.prefix")}
                    />
                    <input
                      type="number"
                      placeholder="Ex: 8822"
                      className="border border-gray-600 bg-gray-700 rounded p-2 w-2/3 text-white"
                      {...form.register("vehicleNumber.number")}
                    />
                  </div>
                  {form.formState.errors.vehicleNumber?.prefix && (
                    <p className="text-red-400 text-xs mt-1">
                      {form.formState.errors.vehicleNumber.prefix.message}
                    </p>
                  )}
                  {form.formState.errors.vehicleNumber?.number && (
                    <p className="text-red-400 text-xs mt-1">
                      {form.formState.errors.vehicleNumber.number.message}
                    </p>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="vehicleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Vehicle Type</FormLabel>
                      <Select
                        onValueChange={handleVehicleTypeChange}
                        defaultValue={field.value?.toString()}
                        disabled={isLoadingVehicleTypes || vehicleTypesError}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            {isLoadingVehicleTypes ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <SelectValue placeholder="Select a vehicle type" />
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-700 border-gray-600 text-white">
                          {groupedVehicles.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.vehicleType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <div>
                  <label className="block mb-2 font-medium text-gray-200">Chassis Number</label>
                  <input
                    type="text"
                    placeholder="Ex: NHKSCM2"
                    className="w-full border border-gray-600 bg-gray-700 rounded p-2 text-white uppercase"
                    {...form.register("chassisNumber")}
                    onChange={(e) => handleUpperCase(e, "chassisNumber")}
                  />
                  {form.formState.errors.chassisNumber && (
                    <p className="text-red-400 text-xs mt-1">
                      {form.formState.errors.chassisNumber.message}
                    </p>
                  )}
                </div>

                {
                  form.getValues("availableFuelTypes") && <div>
                    <label className="block mb-2 font-medium text-gray-200">Select Fuel Type</label>
                    <div className="flex gap-2">
                      {
                        form.getValues("availableFuelTypes")
                          ?.map((fuelType) => (
                            <button
                              key={fuelType}
                              type="button"
                              onClick={() => form.setValue("fuelType", fuelType)}
                              className={`px-4 py-2 rounded ${selectedFuelType === fuelType
                                ? "bg-teal-600 text-white"
                                : "border border-gray-600 text-gray-300 hover:bg-gray-700"
                                }`}
                            >
                              {fuelType.charAt(0) + fuelType.slice(1).toLowerCase()}
                            </button>
                          ))
                      }
                    </div>
                    {form.formState.errors.fuelType && (
                      <p className="text-red-400 text-xs mt-1">
                        {form.formState.errors.fuelType.message}
                      </p>
                    )}
                  </div>}

                <div className="text-sm">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      {...form.register("termsAccepted")} 
                      className="h-4 w-4 text-teal-500 focus:ring-teal-500 border-gray-600 rounded bg-gray-700"
                    />
                    <span className="text-gray-300">
                      I agree to{" "}
                      <a href="#" className="text-teal-400 hover:underline">
                        Terms and Conditions
                      </a>
                    </span>
                  </label>
                  {form.formState.errors.termsAccepted && (
                    <p className="text-red-400 text-xs mt-1">
                      {form.formState.errors.termsAccepted.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 text-white rounded py-3 text-sm font-medium cursor-pointer hover:bg-teal-700 disabled:opacity-50 mt-4"
                >
                  {loading ? "Registering..." : "Register Vehicle"}
                </button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
