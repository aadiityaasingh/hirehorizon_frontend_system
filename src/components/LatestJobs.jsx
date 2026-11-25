import React from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);

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
        {!allJobs || allJobs.length === 0 ? (
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
