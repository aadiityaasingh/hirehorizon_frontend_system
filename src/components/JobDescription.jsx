import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  APPLICATION_API_END_POINT,
  JOB_API_END_POINT,
  USER_API_END_POINT,
} from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { setUser } from "@/redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Navbar from "./Navbar";
import { ExternalLink, Bookmark, Building2, Globe, CheckCircle2, MessageSquare } from "lucide-react";
import AiJobMatch from "./ai/AiJobMatch";
import { useSocket } from "@/context/SocketContext";

const JobDescription = () => {
  const params = useParams();
  const jobId = params.id;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const { openChatWith } = useSocket();

  const [isApplied, setIsApplied] = useState(false);

  const isSaved = user?.profile?.savedJobs?.some(
    (item) => (typeof item === "string" ? item : item?._id) === singleJob?._id
  );

  const applyJobHandler = async () => {
    if (!user) {
      toast.error("Please login to apply for this job");
      navigate("/login");
      return;
    }

    if (user?.role === "recruiter") {
      toast.error("Recruiters cannot apply for jobs");
      return;
    }

    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);

        const updatedSingleJob = {
          ...singleJob,
          applications: [
            ...(singleJob?.applications || []),
            { applicant: user?._id },
          ],
        };

        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Application failed");
    }
  };

  const bookmarkHandler = async () => {
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
        `${USER_API_END_POINT}/savejob/${singleJob?._id}`,
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

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(
          `${JOB_API_END_POINT}/get/${jobId}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));

          const applied = res.data.job.applications?.some(
            (application) =>
              application.applicant === user?._id ||
              application.applicant?._id === user?._id
          );

          setIsApplied(applied);
        }
      } catch (error) {
        console.error("Fetch job error:", error);
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  const hasHtml = /<[a-z][\s\S]*>/i.test(singleJob?.description || "");

  const getSourceBadge = () => {
    const src = (singleJob?.source || "HireHoriZon").toLowerCase();
    if (src.includes("greenhouse")) {
      return (
        <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 font-medium flex items-center gap-1">
          <Globe className="w-3.5 h-3.5" /> Source: Greenhouse ATS ({singleJob?.company?.name})
        </Badge>
      );
    }
    if (src.includes("lever")) {
      return (
        <Badge variant="outline" className="text-violet-700 bg-violet-50 border-violet-200 font-medium flex items-center gap-1">
          <Globe className="w-3.5 h-3.5" /> Source: Lever ATS ({singleJob?.company?.name})
        </Badge>
      );
    }
    if (src.includes("remoteok")) {
      return (
        <Badge variant="outline" className="text-pink-700 bg-pink-50 border-pink-200 font-medium flex items-center gap-1">
          <Globe className="w-3.5 h-3.5" /> Source: RemoteOK (Verified Tech Partner)
        </Badge>
      );
    }
    if (src.includes("weworkremotely")) {
      return (
        <Badge variant="outline" className="text-orange-700 bg-orange-50 border-orange-200 font-medium flex items-center gap-1">
          <Globe className="w-3.5 h-3.5" /> Source: We Work Remotely (Verified Developer Feed)
        </Badge>
      );
    }
    if (src.includes("remotive")) {
      return (
        <Badge variant="outline" className="text-teal-700 bg-teal-50 border-teal-200 font-medium flex items-center gap-1">
          <Globe className="w-3.5 h-3.5" /> Source: Remotive (Verified Remote Partner)
        </Badge>
      );
    }
    if (src.includes("arbeitnow")) {
      return (
        <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-200 font-medium flex items-center gap-1">
          <Globe className="w-3.5 h-3.5" /> Source: Arbeitnow (Verified EU Partner)
        </Badge>
      );
    }
    if (src.includes("jobicy")) {
      return (
        <Badge variant="outline" className="text-indigo-700 bg-indigo-50 border-indigo-200 font-medium flex items-center gap-1">
          <Globe className="w-3.5 h-3.5" /> Source: Jobicy (Verified Global Partner)
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200 font-medium">
        Source: HireHoriZon Direct Employer
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full px-4 py-8 flex-1">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
          {/* Header section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden flex-shrink-0">
                {singleJob?.company?.logo ? (
                  <img
                    src={singleJob.company.logo}
                    alt={singleJob.company.name}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-blue-500" />
                )}
              </div>

              <div>
                <h1 className="font-extrabold text-2xl text-gray-900">
                  {singleJob?.title}
                </h1>

                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 font-medium">
                  <span>{singleJob?.company?.name || "Company"}</span>
                  <span>•</span>
                  <span>{singleJob?.location || "Remote"}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {getSourceBadge()}
                  <Badge className="text-blue-600 bg-blue-50 border-none" variant="outline">
                    {singleJob?.position} Positions
                  </Badge>
                  <Badge className="text-amber-700 bg-amber-50 border-none capitalize" variant="outline">
                    {singleJob?.jobType}
                  </Badge>
                  <Badge className="text-purple-600 bg-purple-50 border-none" variant="outline">
                    {singleJob?.salary} LPA
                  </Badge>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 self-end md:self-center">
              {user?.role !== "recruiter" && (
                <Button
                  variant="outline"
                  onClick={bookmarkHandler}
                  className="flex items-center gap-1.5 border-gray-300 hover:bg-gray-50 cursor-pointer"
                  title={isSaved ? "Remove from saved" : "Save job"}
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      isSaved ? "text-blue-600 fill-blue-600" : "text-gray-500"
                    }`}
                  />
                  <span>{isSaved ? "Saved" : "Save"}</span>
                </Button>
              )}

              {user?.role === "student" && singleJob?.created_by && (
                <Button
                  variant="outline"
                  onClick={() => openChatWith(singleJob.created_by)}
                  className="flex items-center gap-1.5 border-blue-200 text-blue-600 hover:bg-blue-50 cursor-pointer text-sm"
                  title="Message Hiring Team directly"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with Recruiter</span>
                </Button>
              )}

              {singleJob?.isExternal ? (
                <a
                  href={singleJob?.externalApplyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer text-sm"
                >
                  <span>Apply on {singleJob?.source || "Official"} Site</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : user?.role === "recruiter" ? (
                <Button disabled className="bg-gray-400 cursor-not-allowed text-white">
                  Recruiter Account
                </Button>
              ) : (
                <Button
                  onClick={!isApplied ? applyJobHandler : undefined}
                  disabled={isApplied}
                  className={`rounded-lg cursor-pointer ${
                    isApplied
                      ? "bg-gray-600 cursor-not-allowed text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isApplied ? (
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Already Applied
                    </span>
                  ) : (
                    "Apply Now"
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Key Job Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6 p-4 rounded-xl bg-gray-50 border border-gray-100 text-sm">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Experience</p>
              <p className="font-medium text-gray-900 mt-1">
                {singleJob?.experienceLevel ?? 1} Yrs
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Compensation</p>
              <p className="font-medium text-purple-700 mt-1">
                {singleJob?.salary} LPA
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Job Type</p>
              <p className="font-medium text-gray-900 mt-1 capitalize">
                {singleJob?.jobType || "Full-time"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                {singleJob?.isExternal ? "Source Platform" : "Applicants"}
              </p>
              <p className="font-medium text-gray-900 mt-1">
                {singleJob?.isExternal ? singleJob?.source : `${singleJob?.applications?.length || 0} applied`}
              </p>
            </div>
          </div>

          {/* AI Resume-Job Fit Analysis & Cover Letter */}
          <AiJobMatch jobId={jobId} singleJob={singleJob} user={user} />

          {/* Requirements Badges */}
          {singleJob?.requirements?.length > 0 && (
            <div className="my-6">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Required Skills & Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {singleJob.requirements.map((req, idx) => (
                  <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 text-xs py-1 px-2.5 font-normal">
                    {req}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Full Job Description */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h2 className="font-bold text-lg text-gray-900 mb-4">
              Detailed Description
            </h2>

            {hasHtml ? (
              <div
                className="prose max-w-none text-gray-700 text-sm leading-relaxed space-y-3"
                dangerouslySetInnerHTML={{ __html: singleJob?.description }}
              />
            ) : (
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {singleJob?.description}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDescription;
