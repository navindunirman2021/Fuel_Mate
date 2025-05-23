import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import fuelMateImg from "../../../assets/images/fuelMate.jpg";

const HomePage = () => {
  return (
    <div className="bg-gray-900">
      {/* Hero Image at the top */}
      <div className="w-full h-[500px] relative">
        <img
          src={fuelMateImg}
          alt="Fuel Station"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome to FuelMate
            </h1>
            <p className="text-xl text-white max-w-2xl mb-8">
              Simplify your fuel quota management—register your vehicle today and stay in control!
            </p>
            <div className="flex gap-4">
              <Link to="/login">
                <Button size="lg" className="bg-transparent hover:bg-gray-800 text-white border border-white">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6 text-white">
            <h2 className="text-xl font-medium mb-4 text-white">Getting Started:</h2>
            <ul className="list-disc pl-5 space-y-3 text-gray-300">
              <li>Create a new account or log in to your existing one</li>
              <li>Enter your vehicle details to complete the registration</li>
              <li>Track your registration status in real time</li>
              <li>Access your personalized QR code for fuel quota access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
