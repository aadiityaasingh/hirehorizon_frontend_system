import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { Search } from "lucide-react";

const Browse = () => {
  useGetAllJobs();

  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 py-8 flex-1">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-extrabold text-2xl text-gray-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              {searchedQuery ? `Search Results for "${searchedQuery}"` : "All Available Jobs"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Found {allJobs?.length || 0} job opportunity{allJobs?.length === 1 ? "" : "ies"}
            </p>
          </div>
        </div>

        {!allJobs || allJobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center my-6">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">No jobs found</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              We couldn't find any job listings matching your search. Try searching for different skills or roles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allJobs.map((job) => (
              <Job key={job?._id} job={job} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Browse;
