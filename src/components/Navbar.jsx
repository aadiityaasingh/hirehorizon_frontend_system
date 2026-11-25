import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { LogOut, User2, Menu, X, Briefcase, MessageSquare } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";
import { setCompanies } from "@/redux/companySlice";
import { setAllAdminJobs, setAllAppliedJobs } from "@/redux/jobSlice";
import { useSocket } from "@/context/SocketContext";
import logo from "../assets/HireHoriZonlogo.png";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const { unreadCount, openChatWith } = useSocket();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(null));
        dispatch(setCompanies([]));
        dispatch(setAllAdminJobs([]));
        dispatch(setAllAppliedJobs([]));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="HireHoriZon" className="h-9 w-9 object-contain" />
          <span className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">
            Hire<span className="text-blue-600">HoriZon</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex font-medium items-center gap-6 text-sm text-gray-700">
            {user && user.role === "recruiter" ? (
              <>
                <li>
                  <Link
                    to="/"
                    className={`transition-colors hover:text-blue-600 ${
                      isActive("/") ? "text-blue-600 font-semibold" : ""
                    }`}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/companies"
                    className={`transition-colors hover:text-blue-600 ${
                      isActive("/admin/companies") ? "text-blue-600 font-semibold" : ""
                    }`}
                  >
                    Companies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/jobs"
                    className={`transition-colors hover:text-blue-600 ${
                      isActive("/admin/jobs") ? "text-blue-600 font-semibold" : ""
                    }`}
                  >
                    Jobs
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/"
                    className={`transition-colors hover:text-blue-600 ${
                      isActive("/") ? "text-blue-600 font-semibold" : ""
                    }`}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/jobs"
                    className={`transition-colors hover:text-blue-600 ${
                      isActive("/jobs") ? "text-blue-600 font-semibold" : ""
                    }`}
                  >
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/browse"
                    className={`transition-colors hover:text-blue-600 ${
                      isActive("/browse") ? "text-blue-600 font-semibold" : ""
                    }`}
                  >
                    Browse
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Desktop User Profile / Auth buttons */}
          {!user ? (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-800">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openChatWith(null)}
                className="relative text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full cursor-pointer h-9 w-9"
                title="Live Messages"
              >
                <MessageSquare className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center animate-pulse">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Button>

              <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer border border-gray-200">
                  <AvatarImage src={user?.profile?.profilePhoto} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                    {user?.fullname?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>

              <PopoverContent className="w-72 bg-white p-4 shadow-lg rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.profile?.profilePhoto} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                      {user?.fullname?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{user?.fullname}</h4>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1 mt-2">
                  {user?.role === "student" && (
                    <Button
                      variant="ghost"
                      onClick={() => navigate("/profile")}
                      className="justify-start gap-2 h-9 text-gray-700 hover:text-blue-600 text-sm font-normal w-full"
                    >
                      <User2 className="w-4 h-4" />
                      View Profile
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    onClick={logoutHandler}
                    className="justify-start gap-2 h-9 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm font-normal w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {user && (
            <Avatar className="h-8 w-8 cursor-pointer" onClick={() => navigate("/profile")}>
              <AvatarImage src={user?.profile?.profilePhoto} />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-bold">
                {user?.fullname?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3">
          <ul className="space-y-2 font-medium text-gray-700">
            {user && user.role === "recruiter" ? (
              <>
                <li>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 hover:text-blue-600"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/companies"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 hover:text-blue-600"
                  >
                    Companies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 hover:text-blue-600"
                  >
                    Jobs
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 hover:text-blue-600"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 hover:text-blue-600"
                  >
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/browse"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 hover:text-blue-600"
                  >
                    Browse
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="pt-3 border-t border-gray-100 space-y-2">
            {!user ? (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full justify-center bg-blue-600 text-white">
                    Signup
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openChatWith(null);
                  }}
                  className="w-full justify-start gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>Messages</span>
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold rounded-full h-5 px-1.5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
                {user?.role === "student" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full justify-start gap-2"
                  >
                    <User2 className="w-4 h-4" />
                    My Profile
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logoutHandler();
                  }}
                  className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
