import React, { useState, useEffect } from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (allJobs && allJobs.length > 0) {
      setInitialLoading(false);
    } else {
      // Allow max 1.5s for initial API arrival before showing empty state
      const timer = setTimeout(() => {
        setInitialLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [allJobs]);

  return (
    <div className="max-w-7xl mx-auto my-16 px-4">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">
          <span className="text-blue-600">Latest &amp; Top</span> Job Openings
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Explore the newest verified roles freshly posted by our partner recruiters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialLoading && (!allJobs || allJobs.length === 0) ? (
          // Shimmer loading skeletons to eliminate blank flash
          Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border border-gray-100 bg-white shadow-xs space-y-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-gray-200"></div>
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-100 rounded w-full"></div>
              <div className="flex gap-2 pt-2">
                <div className="h-6 w-16 bg-blue-50 rounded-full"></div>
                <div className="h-6 w-16 bg-purple-50 rounded-full"></div>
                <div className="h-6 w-16 bg-emerald-50 rounded-full"></div>
              </div>
            </div>
          ))
        ) : !allJobs || allJobs.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-base font-medium">No job openings available right now.</p>
            <p className="text-xs text-gray-400 mt-1">Check back soon for new opportunities!</p>
          </div>
        ) : (
          allJobs.slice(0, 6).map((job) => <LatestJobCards key={job._id} job={job} />)
        )}
      </div>
    </div>
  );
};

export default LatestJobs;
