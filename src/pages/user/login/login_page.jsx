import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { showToast } from "@/hooks/use-toast";
import apiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/loading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const loginSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits")
    .regex(/^0[0-9]{9}$/, "Phone number must start with 0 and be 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: allData, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await apiService.get("/user/authenticate");
      return response.data.data;
    },
    retry: false,
  });

  const navigate = useNavigate();

  const user = allData?.user;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await apiService.post("/user/login", data);
      if (response.status === 200) {
        const token = response.data.data.token;
        localStorage.setItem("token", token);
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        showToast.success("Login successful!");
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        navigate("/dashboard");
      } else {
        showToast.error(
          response.data.message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message || "Invalid credentials";
        showToast.error(errorMessage);
      } else if (error.request) {
        showToast.error("Server not responding. Please try again later.");
      } else {
        showToast.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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
                <h2 className="text-2xl font-bold text-teal-400 text-center">
                  Welcome Back!
                </h2>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-200"
                    >
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Phone number"
                      className={`h-12 bg-gray-700 border-gray-600 text-white ${errors.phone ? "border-red-500" : ""}`}
                      {...register("phone")}
                      disabled={isSubmitting}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-400 mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-200"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className={`h-12 pr-10 bg-gray-700 border-gray-600 text-white ${errors.password ? "border-red-500" : ""}`}
                        {...register("password")}
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-400 mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white"
                    loading={loading}
                  >
                    Log in
                  </Button>

                  <p className="text-center text-gray-300 mt-4">
                    Don&apos;t have an account?{" "}
                    <Link to="/signup" className="text-teal-400 hover:underline">
                      Sign Up
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
