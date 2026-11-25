import React from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { MapPin, Building2, Clock, Bookmark, Globe, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const formatDaysAgo = (dateStr) => {
    if (!dateStr) return "Recently";
    const createdAt = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  const daysAgo = formatDaysAgo(job?.createdAt);

  const isSaved = user?.profile?.savedJobs?.some(
    (item) => (typeof item === "string" ? item : item?._id) === job?._id
  );

  // Quick fit match calculation for logged-in students with skills
  const candidateSkills = (user?.profile?.skills || []).map((s) => s.toLowerCase());
  const jobRequirements = (job?.requirements || []).map((r) => r.toLowerCase());
  let matchPercentage = null;
  if (user?.role !== "recruiter" && candidateSkills.length > 0 && jobRequirements.length > 0) {
    const matches = jobRequirements.filter((req) =>
      candidateSkills.some((c) => req.includes(c) || c.includes(req))
    );
    matchPercentage = Math.round((matches.length / jobRequirements.length) * 100);
  }

  const bookmarkHandler = async (e) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to save jobs");
      navigate("/login");
      return;
    }

    if (user?.role === "recruiter") {
      toast.error("Recruiter accounts cannot save jobs");
      return;
    }

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/savejob/${job?._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(
          setUser({
            ...user,
            profile: {
              ...(user.profile || {}),
              savedJobs: res.data.savedJobs,
            },
          })
        );
      }
    } catch (error) {
      console.error("Save job error:", error);
      toast.error(error.response?.data?.message || "Failed to update saved job");
    }
  };

  // Helper for source badge styling
  const getSourceBadge = () => {
    const src = (job?.source || "HireHoriZon").toLowerCase();
    if (src.includes("greenhouse")) {
      return (
        <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 text-[11px] font-medium flex items-center gap-1">
          <Globe className="w-3 h-3" /> Greenhouse
        </Badge>
      );
    }
    if (src.includes("lever")) {
      return (
        <Badge variant="outline" className="text-violet-700 bg-violet-50 border-violet-200 text-[11px] font-medium flex items-center gap-1">
          <Globe className="w-3 h-3" /> Lever
        </Badge>
      );
    }
    if (src.includes("remoteok")) {
      return (
        <Badge variant="outline" className="text-pink-700 bg-pink-50 border-pink-200 text-[11px] font-medium flex items-center gap-1">
          <Globe className="w-3 h-3" /> RemoteOK
        </Badge>
      );
    }
    if (src.includes("weworkremotely")) {
      return (
        <Badge variant="outline" className="text-orange-700 bg-orange-50 border-orange-200 text-[11px] font-medium flex items-center gap-1">
          <Globe className="w-3 h-3" /> WWR
        </Badge>
      );
    }
    if (src.includes("remotive")) {
      return (
        <Badge variant="outline" className="text-teal-700 bg-teal-50 border-teal-200 text-[11px] font-medium flex items-center gap-1">
          <Globe className="w-3 h-3" /> Remotive
        </Badge>
      );
    }
    if (src.includes("arbeitnow")) {
      return (
        <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-200 text-[11px] font-medium flex items-center gap-1">
          <Globe className="w-3 h-3" /> Arbeitnow
        </Badge>
      );
    }
    if (src.includes("jobicy")) {
      return (
        <Badge variant="outline" className="text-indigo-700 bg-indigo-50 border-indigo-200 text-[11px] font-medium flex items-center gap-1">
          <Globe className="w-3 h-3" /> Jobicy
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200 text-[11px] font-medium">
        Direct Employer
      </Badge>
    );
  };

  // Strip HTML tags for card preview snippet
  const cleanDescription = (job?.description || "")
    .replace(/&amp;amp;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]*>?/gm, " ")
    .replace(/\s+/g, " ")
    .trim();

  return (
    <div
      onClick={() => navigate(`/description/${job?._id}`)}
      className="p-6 w-full rounded-xl shadow-sm hover:shadow-lg bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
    >
      <div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {daysAgo}
          </span>
          <div className="flex items-center gap-1.5">
            {getSourceBadge()}
            <Badge variant="outline" className="text-gray-600 bg-gray-50 font-normal capitalize">
              {job?.jobType || "Full-time"}
            </Badge>
            {user?.role !== "recruiter" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={bookmarkHandler}
                className="h-7 w-7 rounded-full hover:bg-gray-100"
                title={isSaved ? "Remove from saved" : "Save for later"}
              >
                <Bookmark
                  className={`w-4 h-4 transition-colors ${
                    isSaved ? "text-blue-600 fill-blue-600" : "text-gray-400 hover:text-gray-600"
                  }`}
                />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 my-2">
          <Avatar className="h-11 w-11 rounded-lg border border-gray-100 flex-shrink-0">
            <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
            <AvatarFallback className="bg-blue-50 text-blue-600 font-bold rounded-lg text-sm">
              {job?.company?.name?.slice(0, 2).toUpperCase() || <Building2 className="w-4 h-4" />}
            </AvatarFallback>
          </Avatar>

          <div className="overflow-hidden">
            <h2 className="font-semibold text-gray-900 truncate">
              {job?.company?.name || "Company"}
            </h2>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{job?.location || "Remote"}</span>
            </p>
          </div>
        </div>

        <div className="my-3">
          <h1 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {job?.title}
          </h1>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1 leading-relaxed">
            {cleanDescription}
          </p>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2 my-4">
          {matchPercentage !== null && matchPercentage > 0 && (
            <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium border-none flex items-center gap-1 text-[11px] shadow-xs" variant="outline">
              <Sparkles className="w-3 h-3" /> {matchPercentage}% Fit
            </Badge>
          )}
          <Badge className="text-blue-600 bg-blue-50 hover:bg-blue-100 font-medium border-none" variant="outline">
            {job?.position || "1"} Position{job?.position === "1" ? "" : "s"}
          </Badge>
          <Badge className="text-purple-600 bg-purple-50 hover:bg-purple-100 font-medium border-none" variant="outline">
            {job?.salary} LPA
          </Badge>
          {job?.experienceLevel !== undefined && (
            <Badge className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 font-medium border-none" variant="outline">
              {job.experienceLevel} Yrs Exp
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/description/${job?._id}`);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Job;
