import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  FileText,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Search,
  Calendar,
  CheckCircle2,
  XCircle,
  Inbox,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { updateApplicantStatus } from "@/redux/applicationSlice";
import { useSocket } from "@/context/SocketContext";
import { toast } from "sonner";

const STAGES = [
  {
    id: "pending",
    label: "Applied",
    color: "amber",
    headerBg: "bg-amber-50 text-amber-800 border-amber-200",
    badgeBg: "bg-amber-100 text-amber-800",
    icon: Inbox,
  },
  {
    id: "screening",
    label: "Screening",
    color: "blue",
    headerBg: "bg-blue-50 text-blue-800 border-blue-200",
    badgeBg: "bg-blue-100 text-blue-800",
    icon: Search,
  },
  {
    id: "interview",
    label: "Interview",
    color: "purple",
    headerBg: "bg-purple-50 text-purple-800 border-purple-200",
    badgeBg: "bg-purple-100 text-purple-800",
    icon: Calendar,
  },
  {
    id: "accepted",
    label: "Offer / Accepted",
    color: "emerald",
    headerBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    badgeBg: "bg-emerald-100 text-emerald-800",
    icon: CheckCircle2,
  },
  {
    id: "rejected",
    label: "Rejected",
    color: "rose",
    headerBg: "bg-rose-50 text-rose-800 border-rose-200",
    badgeBg: "bg-rose-100 text-rose-800",
    icon: XCircle,
  },
];

const ApplicantsKanban = ({ applications = [] }) => {
  const dispatch = useDispatch();
  const { openChatWith } = useSocket();

  const statusHandler = async (status, id) => {
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || `Moved to ${status}`);
        dispatch(updateApplicantStatus({ id, status }));
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error(error.response?.data?.message || "Status update failed");
    }
  };

  const getStageApplications = (stageId) => {
    return applications.filter((app) => {
      const s = (app?.status || "pending").toLowerCase();
      return s === stageId;
    });
  };

  const getNextStage = (currentStage) => {
    const s = (currentStage || "pending").toLowerCase();
    const idx = STAGES.findIndex((st) => st.id === s);
    if (idx >= 0 && idx < STAGES.length - 1) {
      return STAGES[idx + 1].id;
    }
    return null;
  };

  const getPrevStage = (currentStage) => {
    const s = (currentStage || "pending").toLowerCase();
    const idx = STAGES.findIndex((st) => st.id === s);
    if (idx > 0) {
      return STAGES[idx - 1].id;
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
      {STAGES.map((stage) => {
        const stageApps = getStageApplications(stage.id);
        const IconComponent = stage.icon;

        return (
          <div
            key={stage.id}
            className="flex flex-col bg-gray-50/80 rounded-2xl border border-gray-200/80 p-3 min-w-[240px] max-w-full"
          >
            {/* Column Header */}
            <div
              className={`flex items-center justify-between p-2.5 rounded-xl border mb-3 font-semibold text-xs ${stage.headerBg}`}
            >
              <div className="flex items-center gap-2">
                <IconComponent className="w-4 h-4" />
                <span>{stage.label}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${stage.badgeBg}`}>
                {stageApps.length}
              </span>
            </div>

            {/* Cards Container */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-0.5">
              {stageApps.length === 0 ? (
                <div className="h-28 border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-center text-xs text-gray-400 p-3">
                  No candidates in {stage.label.toLowerCase()}
                </div>
              ) : (
                stageApps.map((app) => {
                  const candidate = app?.applicant;
                  const skills = candidate?.profile?.skills || [];
                  const nextStage = getNextStage(app?.status);
                  const prevStage = getPrevStage(app?.status);

                  return (
                    <div
                      key={app._id}
                      className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-xs hover:shadow-md transition-shadow flex flex-col gap-2.5"
                    >
                      {/* Candidate Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar className="w-8 h-8 border border-gray-100 flex-shrink-0">
                            <AvatarImage src={candidate?.profile?.profilePhoto} />
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-bold">
                              {candidate?.fullname?.slice(0, 2).toUpperCase() || <User className="w-4 h-4" />}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-gray-900 truncate">
                              {candidate?.fullname || "Unknown"}
                            </h4>
                            <p className="text-[10px] text-gray-400 flex items-center gap-1 truncate">
                              <Mail className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{candidate?.email}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Phone */}
                      {candidate?.phoneNumber && (
                        <p className="text-[11px] text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{candidate?.phoneNumber}</span>
                        </p>
                      )}

                      {/* Skills badges */}
                      {skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {skills.slice(0, 3).map((sk, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="bg-gray-50 text-gray-600 border-gray-200 text-[10px] px-1.5 py-0 font-normal"
                            >
                              {sk}
                            </Badge>
                          ))}
                          {skills.length > 3 && (
                            <span className="text-[10px] text-gray-400 font-medium">
                              +{skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Resume link & Chat button */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        {candidate?.profile?.resume ? (
                          <a
                            href={candidate.profile.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Resume</span>
                          </a>
                        ) : (
                          <span className="text-[10px] text-gray-300">No Resume</span>
                        )}

                        {candidate && (
                          <button
                            type="button"
                            onClick={() => openChatWith(candidate)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded cursor-pointer transition-colors"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>Chat</span>
                          </button>
                        )}
                      </div>

                      {/* Stage Transition Controls */}
                      <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-gray-50 text-[11px]">
                        {prevStage ? (
                          <button
                            type="button"
                            onClick={() => statusHandler(prevStage, app._id)}
                            className="inline-flex items-center text-[10px] text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-1 rounded cursor-pointer"
                            title={`Move back to ${prevStage}`}
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span className="capitalize">{prevStage}</span>
                          </button>
                        ) : (
                          <div />
                        )}

                        {nextStage ? (
                          <button
                            type="button"
                            onClick={() => statusHandler(nextStage, app._id)}
                            className="inline-flex items-center gap-0.5 text-[10px] font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-1.5 py-1 rounded cursor-pointer ml-auto"
                            title={`Advance to ${nextStage}`}
                          >
                            <span className="capitalize">{nextStage}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        ) : stage.id !== "rejected" ? (
                          <button
                            type="button"
                            onClick={() => statusHandler("rejected", app._id)}
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-rose-600 hover:bg-rose-50 px-1.5 py-1 rounded cursor-pointer ml-auto"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ApplicantsKanban;
