import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);

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
    return (
      <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 font-medium">
        Pending
      </Badge>
    );
  };

  return (
    <div>
      <Table>
        <TableCaption>A comprehensive record of all jobs you have applied to</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Applied Date</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {!allAppliedJobs || allAppliedJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                You haven&apos;t applied to any jobs yet. Browse available listings and apply!
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob?._id}>
                <TableCell className="text-sm text-gray-600">
                  {appliedJob?.createdAt?.split("T")[0]}
                </TableCell>

                <TableCell className="font-semibold text-gray-900">
                  {appliedJob?.job?.title || "Role not found"}
                </TableCell>

                <TableCell className="text-sm text-gray-700">
                  {appliedJob?.job?.company?.name || "Company"}
                </TableCell>

                <TableCell className="text-right">
                  {getStatusBadge(appliedJob?.status)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
