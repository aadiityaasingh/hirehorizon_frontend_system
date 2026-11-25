import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useDispatch } from "react-redux";
import AdminJobsTable from "./AdminJobsTable";
import { setSearchJobByText } from "@/redux/jobSlice";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import { Search, Plus, Briefcase } from "lucide-react";

const AdminJobs = () => {
  useGetAllAdminJobs();

  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto w-full px-4 py-8 flex-1">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-600" />
              Posted Jobs
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage your active job postings, edit details, and track applicant shortlists.
            </p>
          </div>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2 cursor-pointer shadow-sm"
            onClick={() => navigate("/admin/jobs/create")}
          >
            <Plus className="w-4 h-4" />
            <span>Post New Job</span>
          </Button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="mb-6 max-w-sm relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <Input
              className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-blue-500"
              placeholder="Search by role or company..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <AdminJobsTable />
        </div>
      </main>
    </div>
  );
};

export default AdminJobs;
