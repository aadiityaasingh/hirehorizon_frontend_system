import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white py-12 border-t border-gray-800">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & About */}
          <div>
            <h2 className="text-2xl font-bold">
              Hire<span className="text-blue-500">HoriZon</span>
            </h2>
            <p className="mt-3 text-gray-400 text-sm leading-relaxed">
              Your trusted platform to discover curated job opportunities, connect with top companies, and accelerate your career.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-blue-400">Quick Links</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Jobs
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Browse Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h3 className="text-lg font-semibold text-blue-400">Contact Us</h3>
            <div className="mt-3 space-y-2 text-sm text-gray-400">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>support@hirehorizon.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>+91 98765 43210</span>
              </p>
            </div>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-full bg-gray-900 hover:bg-gray-800"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-full bg-gray-900 hover:bg-gray-800"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-full bg-gray-900 hover:bg-gray-800"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} HireHoriZon. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
