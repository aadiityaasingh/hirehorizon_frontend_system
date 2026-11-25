import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companySlice";
import { Search, Plus, Building2 } from "lucide-react";

const Companies = () => {
  useGetAllCompanies();

  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto w-full px-4 py-8 flex-1">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              Registered Companies
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage your company profiles, logos, websites, and office locations.
            </p>
          </div>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2 cursor-pointer shadow-sm"
            onClick={() => navigate("/admin/companies/create")}
          >
            <Plus className="w-4 h-4" />
            <span>New Company</span>
          </Button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="mb-6 max-w-sm relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <Input
              className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-blue-500"
              placeholder="Filter companies by name..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <CompaniesTable />
        </div>
      </main>
    </div>
  );
};

export default Companies;
