import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  MoreHorizontal,
  FileText,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Search,
  Calendar,
  RotateCcw,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { updateApplicantStatus } from "@/redux/applicationSlice";
import { useSocket } from "@/context/SocketContext";
import { toast } from "sonner";

const ApplicantsTable = () => {
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);
  const { openChatWith } = useSocket();

  const applicationsList =
    applicants?.applications ||
    (Array.isArray(applicants?.applicants)
      ? applicants.applicants
      : Array.isArray(applicants)
      ? applicants
      : []);

  const statusHandler = async (status, id) => {
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || `Status updated to ${status}`);
        dispatch(updateApplicantStatus({ id, status }));
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error(error.response?.data?.message || "Status update failed");
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || "pending").toLowerCase();
    if (s === "accepted") {
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-medium">
          Accepted
        </Badge>
      );
    }
    if (s === "rejected") {
      return (
        <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 font-medium">
          Rejected
        </Badge>
      );
    }
    if (s === "screening") {
      return (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 font-medium">
          Screening
        </Badge>
      );
    }
    if (s === "interview") {
      return (
        <Badge className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 font-medium">
          Interview
        </Badge>
      );
    }
    return (
      <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 font-medium">
        Applied (Pending)
      </Badge>
    );
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>A list of applicants who applied for this role</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Candidate</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {applicationsList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                No applicants found for this position yet.
              </TableCell>
            </TableRow>
          ) : (
            applicationsList.map((item) => (
              <TableRow key={item?._id} className="hover:bg-gray-50/50">
                <TableCell>
                  <div className="font-semibold text-gray-900">
                    {item?.applicant?.fullname || "Unknown"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item?.applicant?.email}
                  </div>
                </TableCell>

                <TableCell className="text-sm text-gray-600">
                  {item?.applicant?.phoneNumber || "N/A"}
                </TableCell>

                <TableCell>
                  {item?.applicant?.profile?.resume ? (
                    <a
                      className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline bg-blue-50 px-2.5 py-1 rounded"
                      href={item?.applicant?.profile?.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{item?.applicant?.profile?.resumeOriginalName || "View Resume"}</span>
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">No Resume</span>
                  )}
                </TableCell>

                <TableCell className="text-sm text-gray-600">
                  {item?.createdAt?.split("T")[0] || "Recently"}
                </TableCell>

                <TableCell>{getStatusBadge(item?.status)}</TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {item?.applicant && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openChatWith(item.applicant)}
                        className="h-8 text-xs flex items-center gap-1 border-blue-200 text-blue-600 hover:bg-blue-50 cursor-pointer"
                        title="Chat with Candidate"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Chat</span>
                      </Button>
                    )}

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                          <MoreHorizontal className="w-4 h-4 text-gray-600" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent align="end" className="w-44 p-1.5 space-y-1 bg-white shadow-xl">
                        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Move to Stage
                        </div>

                        <button
                          onClick={() => statusHandler("screening", item?._id)}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                        >
                          <Search className="w-3.5 h-3.5 text-blue-600" />
                          <span>Screening</span>
                        </button>

                        <button
                          onClick={() => statusHandler("interview", item?._id)}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-50 rounded cursor-pointer transition-colors"
                        >
                          <Calendar className="w-3.5 h-3.5 text-purple-600" />
                          <span>Interview</span>
                        </button>

                        <button
                          onClick={() => statusHandler("accepted", item?._id)}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50 rounded cursor-pointer transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Accept / Offer</span>
                        </button>

                        <button
                          onClick={() => statusHandler("rejected", item?._id)}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded cursor-pointer transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Reject</span>
                        </button>

                        <button
                          onClick={() => statusHandler("pending", item?._id)}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded cursor-pointer transition-colors border-t border-gray-100 pt-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
                          <span>Reset to Applied</span>
                        </button>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
