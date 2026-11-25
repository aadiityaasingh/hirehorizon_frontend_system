import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import ApplicantsTable from "./ApplicantsTable";
import ApplicantsKanban from "./ApplicantsKanban";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "@/redux/applicationSlice";
import { Button } from "../ui/button";
import {
  ArrowLeft,
  Users,
  Download,
  LayoutGrid,
  Table as TableIcon,
  Search,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const Applicants = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);

  const [viewMode, setViewMode] = useState("kanban"); // "table" | "kanban"
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllApplicants = async () => {
      try {
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/${params.id}/applicants`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setAllApplicants(res.data.job || res.data));
        }
      } catch (error) {
        console.error("Fetch applicants error:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch applicants"
        );
      }
    };

    fetchAllApplicants();
  }, [params.id, dispatch]);

  const rawApplicationsList =
    applicants?.applications ||
    (Array.isArray(applicants?.applicants)
      ? applicants.applicants
      : Array.isArray(applicants)
      ? applicants
      : []);

  const applicationsList = rawApplicationsList.filter((app) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const name = (app?.applicant?.fullname || "").toLowerCase();
    const email = (app?.applicant?.email || "").toLowerCase();
    const skills = (app?.applicant?.profile?.skills || []).map((s) =>
      s.toLowerCase()
    );
    return (
      name.includes(term) ||
      email.includes(term) ||
      skills.some((s) => s.includes(term))
    );
  });

  const applicantCount = rawApplicationsList.length;

  const exportCsvHandler = () => {
    if (rawApplicationsList.length === 0) {
      toast.info("No applicants to export");
      return;
    }

    const headers = [
      "Candidate Name",
      "Email",
      "Phone",
      "Current Pipeline Stage",
      "Skills",
      "Applied Date",
      "Resume Link",
    ];

    const rows = rawApplicationsList.map((app) => [
      `"${(app?.applicant?.fullname || "").replace(/"/g, '""')}"`,
      `"${(app?.applicant?.email || "").replace(/"/g, '""')}"`,
      `"${(app?.applicant?.phoneNumber || "").replace(/"/g, '""')}"`,
      `"${(app?.status || "pending").replace(/"/g, '""')}"`,
      `"${(app?.applicant?.profile?.skills || []).join("; ").replace(/"/g, '""')}"`,
      `"${(app?.createdAt?.split("T")[0] || "").replace(/"/g, '""')}"`,
      `"${(app?.applicant?.profile?.resume || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const jobTitle = (applicants?.title || "Role").replace(/[^a-zA-Z0-9]/g, "_");
    link.setAttribute(
      "download",
      `Applicants_${jobTitle}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Applicants exported to CSV successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 py-8 flex-1">
        {/* Header bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin/jobs")}
              className="flex items-center gap-1.5 text-gray-600 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Jobs</span>
            </Button>

            <div>
              <h1 className="font-bold text-2xl text-gray-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                Applicant Pipeline ({applicantCount})
              </h1>
              <p className="text-xs text-gray-500">
                Job: <span className="font-semibold text-gray-800">{applicants?.title || "Loading..."}</span> • Manage candidate status & pipeline stages
              </p>
            </div>
          </div>

          {/* Action toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search candidate */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search candidate or skill..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-48 sm:w-56"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
              <button
                type="button"
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-all ${
                  viewMode === "kanban"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-all ${
                  viewMode === "table"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
            </div>

            {/* Export CSV button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={exportCsvHandler}
              className="text-xs flex items-center gap-1.5 border-gray-200 hover:bg-gray-100 cursor-pointer text-gray-700"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>

        {/* Content Area */}
        {viewMode === "kanban" ? (
          <ApplicantsKanban applications={applicationsList} />
        ) : (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <ApplicantsTable />
          </div>
        )}
      </main>
    </div>
  );
};

export default Applicants;
