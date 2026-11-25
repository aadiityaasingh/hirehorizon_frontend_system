import React from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { MapPin, Building2, Globe } from "lucide-react";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  const getSourceBadge = () => {
    const src = (job?.source || "HireHoriZon").toLowerCase();
    if (src.includes("greenhouse")) {
      return (
        <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 text-[10px] font-medium flex items-center gap-1">
          <Globe className="w-2.5 h-2.5" /> Greenhouse
        </Badge>
      );
    }
    if (src.includes("lever")) {
      return (
        <Badge variant="outline" className="text-violet-700 bg-violet-50 border-violet-200 text-[10px] font-medium flex items-center gap-1">
          <Globe className="w-2.5 h-2.5" /> Lever
        </Badge>
      );
    }
    if (src.includes("remoteok")) {
      return (
        <Badge variant="outline" className="text-pink-700 bg-pink-50 border-pink-200 text-[10px] font-medium flex items-center gap-1">
          <Globe className="w-2.5 h-2.5" /> RemoteOK
        </Badge>
      );
    }
    if (src.includes("weworkremotely")) {
      return (
        <Badge variant="outline" className="text-orange-700 bg-orange-50 border-orange-200 text-[10px] font-medium flex items-center gap-1">
          <Globe className="w-2.5 h-2.5" /> WWR
        </Badge>
      );
    }
    if (src.includes("remotive")) {
      return (
        <Badge variant="outline" className="text-teal-700 bg-teal-50 border-teal-200 text-[10px] font-medium flex items-center gap-1">
          <Globe className="w-2.5 h-2.5" /> Remotive
        </Badge>
      );
    }
    if (src.includes("arbeitnow")) {
      return (
        <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-200 text-[10px] font-medium flex items-center gap-1">
          <Globe className="w-2.5 h-2.5" /> Arbeitnow
        </Badge>
      );
    }
    if (src.includes("jobicy")) {
      return (
        <Badge variant="outline" className="text-indigo-700 bg-indigo-50 border-indigo-200 text-[10px] font-medium flex items-center gap-1">
          <Globe className="w-2.5 h-2.5" /> Jobicy
        </Badge>
      );
    }
    return null;
  };

  const cleanDescription = (job?.description || "").replace(/<[^>]*>?/gm, " ").trim();

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 bg-white border border-gray-200 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden flex-shrink-0">
              {job?.company?.logo ? (
                <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-5 h-5 text-blue-500" />
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-base">{job?.company?.name || "Company"}</h2>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {job?.location || "Remote"}
              </p>
            </div>
          </div>
          {getSourceBadge()}
        </div>

        <div className="mt-4">
          <h3 className="font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">
            {job?.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2 leading-relaxed">
            {cleanDescription}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-5 pt-3 border-t border-gray-100">
        <Badge className="text-blue-600 bg-blue-50 hover:bg-blue-100 font-medium border-none" variant="outline">
          {job?.position || "1"} Position{job?.position === "1" ? "" : "s"}
        </Badge>
        <Badge className="text-amber-600 bg-amber-50 hover:bg-amber-100 font-medium border-none capitalize" variant="outline">
          {job?.jobType}
        </Badge>
        <Badge className="text-purple-600 bg-purple-50 hover:bg-purple-100 font-medium border-none" variant="outline">
          {job?.salary} LPA
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCards;
