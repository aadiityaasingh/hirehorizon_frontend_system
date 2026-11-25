import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { Briefcase } from "lucide-react";

const Jobs = () => {
  useGetAllJobs();

  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs || []);

  useEffect(() => {
    if (!allJobs || allJobs.length === 0) {
      setFilterJobs([]);
      return;
    }

    if (!searchedQuery) {
      setFilterJobs(allJobs);
      return;
    }

    const q = searchedQuery.toLowerCase().trim();

    const filtered = allJobs.filter((job) => {
      // 1. Check Job Source filters
      if (q === "direct employers" || q === "direct") {
        return !job?.isExternal;
      }
      if (q === "remotive") {
        return job?.source?.toLowerCase().includes("remotive");
      }
      if (q === "remoteok") {
        return job?.source?.toLowerCase().includes("remoteok");
      }
      if (q === "weworkremotely" || q === "wwr") {
        return job?.source?.toLowerCase().includes("weworkremotely");
      }
      if (q.includes("greenhouse")) {
        return job?.source?.toLowerCase().includes("greenhouse");
      }
      if (q.includes("lever")) {
        return job?.source?.toLowerCase().includes("lever");
      }
      if (q === "arbeitnow") {
        return job?.source?.toLowerCase().includes("arbeitnow");
      }
      if (q === "jobicy") {
        return job?.source?.toLowerCase().includes("jobicy");
      }

      // 2. Check Salary range filters
      if (q === "0-6 lpa") {
        return Number(job?.salary) >= 0 && Number(job?.salary) <= 6;
      }
      if (q === "6-12 lpa") {
        return Number(job?.salary) >= 6 && Number(job?.salary) <= 12;
      }
      if (q === "12-20 lpa") {
        return Number(job?.salary) >= 12 && Number(job?.salary) <= 20;
      }
      if (q === "20+ lpa") {
        return Number(job?.salary) >= 20;
      }

      // 3. Check Job type filter
      if (["full-time", "part-time", "internship"].includes(q)) {
        return job?.jobType?.toLowerCase() === q;
      }

      // 4. Check Location, Title, Description, Company Name, Requirements, and Source
      const matchTitle = job?.title?.toLowerCase().includes(q);
      const matchDesc = job?.description?.toLowerCase().includes(q);
      const matchLocation = job?.location?.toLowerCase().includes(q);
      const matchCompany = job?.company?.name?.toLowerCase().includes(q);
      const matchSource = job?.source?.toLowerCase().includes(q);
      const matchRequirements = Array.isArray(job?.requirements)
        ? job.requirements.some((r) => r.toLowerCase().includes(q))
        : false;

      return (
        matchTitle ||
        matchDesc ||
        matchLocation ||
        matchCompany ||
        matchSource ||
        matchRequirements
      );
    });

    setFilterJobs(filtered);
  }, [allJobs, searchedQuery]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 py-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Sidebar - Sticky on desktop */}
          <aside className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
            <FilterCard />
          </aside>

          {/* Right Section - Job Cards */}
          <section className="flex-1 w-full min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Available Jobs ({filterJobs.length})
              </h1>
              {searchedQuery && (
                <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                  Filtered by: <strong className="text-blue-600">{searchedQuery}</strong>
                </span>
              )}
            </div>

            {filterJobs.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center my-6">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">No jobs match your criteria</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your filters or resetting to find open opportunities.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filterJobs.map((job) => (
                  <motion.div
                    key={job?._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Job job={job} />
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Jobs;
