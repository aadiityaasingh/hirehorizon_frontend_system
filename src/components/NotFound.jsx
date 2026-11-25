import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { FileQuestion, Home } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <div className="max-w-md mx-auto text-center px-4 py-16 flex-1 flex flex-col justify-center items-center">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
          <FileQuestion className="w-10 h-10" />
        </div>

        <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mt-2">Page Not Found</h2>
        <p className="text-gray-500 text-sm mt-2 leading-relaxed">
          The page you are looking for does not exist, has been removed, or is temporarily unavailable.
        </p>

        <Link to="/" className="mt-6">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
