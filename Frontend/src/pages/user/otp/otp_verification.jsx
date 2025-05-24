import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import apiService from "@/services/api.service";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { alert } from "@/lib/alert";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { getUserPhone } from "@/services/user.service";
import Loading from "@/components/loading";
import { Loader2 } from "lucide-react";

const OtpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be exactly 6 digits")
    .max(6, "OTP must be exactly 6 digits")
    .regex(/^[0-9]+$/, "OTP must contain only numbers"),
});

export default function VerifyOtpPage() {
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

  const { data: userPhone } = useQuery({
    queryKey: ["userPhone"],
    queryFn: getUserPhone,
  });

  const { mutate: verifyOtp, isPending: isVerifying } = useMutation({
    mutationFn: (data) => apiService.post("/verification/verify", { code: data.otp }),
    onSuccess: () => {
      alert.success("OTP verified successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      alert.error(error.response.data?.message || "Verification failed");
    },
  });

  const { mutate: resendOtp, isPending: isResending } = useMutation({
    mutationFn: () => apiService.get("/verification/resend"),
    onSuccess: () => {
      alert.success("New OTP has been sent!");
      form.reset();
    },
    onError: (error) => {
      alert.error(error.response.data?.message || "Failed to resend OTP");
    },
  });


  const form = useForm({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data) => {
    verifyOtp(data);
  };

  const handleResendOTP = async () => {
    resendOtp();
  };

  useEffect(() => {

    const sendInitialOTP = async () => {
      const token = localStorage.getItem("token");
      if (!token) navigate("/login");
    };

    sendInitialOTP();
  }, [navigate]);

  if (!isLoading && !user) {
    return <Navigate to="/login" />;
  }

  if (!isLoading && user.verified) {
    return <Navigate to="/dashboard" />;
  }

  return isLoading ? <Loading /> : (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center py-0 px-4">
      <div className="w-full max-w-xl bg-gray-800 rounded-xl p-10 shadow-2xl border border-gray-700 my-auto">
        <h1 className="text-teal-400 text-4xl font-bold text-center mb-8">
          Verify Your Account
        </h1>
        
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-white text-lg text-center">
              We've sent a 6-digit verification code to:
            </p>
            <p className="text-xl font-semibold text-center text-white">
              {userPhone || "your phone"}
            </p>
            <p className="text-center text-gray-300 text-lg">
              Not your number?{" "}
              <span
                className="text-teal-400 cursor-pointer hover:underline font-medium"
                onClick={() => navigate("/phone")}
              >
                Change
              </span>
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <label className="font-medium text-xl block text-center text-white">
                Enter Verification Code
              </label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  {...form.register("otp")}
                  className="gap-3"
                >
                  <InputOTPGroup>
                    <InputOTPSlot 
                      index={0} 
                      className="w-12 h-14 bg-gray-700 text-white border-gray-600 text-2xl" 
                    />
                    <InputOTPSlot 
                      index={1} 
                      className="w-12 h-14 bg-gray-700 text-white border-gray-600 text-2xl" 
                    />
                    <InputOTPSlot 
                      index={2} 
                      className="w-12 h-14 bg-gray-700 text-white border-gray-600 text-2xl" 
                    />
                    <InputOTPSlot 
                      index={3} 
                      className="w-12 h-14 bg-gray-700 text-white border-gray-600 text-2xl" 
                    />
                    <InputOTPSlot 
                      index={4} 
                      className="w-12 h-14 bg-gray-700 text-white border-gray-600 text-2xl" 
                    />
                    <InputOTPSlot 
                      index={5} 
                      className="w-12 h-14 bg-gray-700 text-white border-gray-600 text-2xl" 
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {form.formState.errors.otp && (
                <p className="text-red-400 text-base mt-2 text-center">
                  {form.formState.errors.otp.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              loading={isVerifying}
              className="w-full py-6 text-lg bg-teal-600 hover:bg-teal-700"
            >
              Verify Code
            </Button>
          </form>

          <div className="flex justify-center items-center text-lg mt-6">
            <p className="text-gray-300">
              Didn't receive the code?{" "}
            </p>
            <button
              className="text-teal-400 ml-2 font-medium hover:underline disabled:opacity-50 disabled:hover:no-underline flex items-center"
              onClick={isResending ? undefined : handleResendOTP}
              disabled={isResending}
            >
              {isResending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Resend Code"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
