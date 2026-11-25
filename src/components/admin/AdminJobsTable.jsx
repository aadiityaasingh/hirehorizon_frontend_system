import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAllAdminJobs } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { toast } from "sonner";

const AdminJobsTable = () => {
  const dispatch = useDispatch();
  const { allAdminJobs, searchJobByText } = useSelector(
    (store) => store.job
  );

  const [filterJobs, setFilterJobs] = useState([]);
  const navigate = useNavigate();

  const deleteJobHandler = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job listing?")) return;

    try {
      const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Job deleted successfully");
        const updated = (allAdminJobs || []).filter((j) => j._id !== jobId);
        dispatch(setAllAdminJobs(updated));
      }
    } catch (error) {
      console.error("Delete job error:", error);
      toast.error(error.response?.data?.message || "Failed to delete job");
    }
  };

  useEffect(() => {

    if (!Array.isArray(allAdminJobs)) {
      setFilterJobs([]);
      return;
    }

    const filteredJobs = allAdminJobs.filter((job) => {

      if (!searchJobByText) return true;

      return (
        job?.title
          ?.toLowerCase()
          .includes(searchJobByText.toLowerCase()) ||
        job?.company?.name
          ?.toLowerCase()
          .includes(searchJobByText.toLowerCase())
      );

    });

    setFilterJobs(filteredJobs);

  }, [allAdminJobs, searchJobByText]);

  return (
    <div>

      <Table>

        <TableCaption>
          A list of your recent posted jobs
        </TableCaption>

        <TableHeader>

          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">
              Action
            </TableHead>
          </TableRow>

        </TableHeader>

        <TableBody>
          {filterJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                No jobs found. Click &quot;New Jobs&quot; to post your first opening.
              </TableCell>
            </TableRow>
          ) : (
            filterJobs.map((job) => (

            <TableRow key={job?._id}>

              <TableCell className="cursor-pointer">
                {job?.company?.name}
              </TableCell>

              <TableCell className="cursor-pointer">
                {job?.title}
              </TableCell>

              <TableCell className="cursor-pointer">
                {job?.createdAt?.split("T")[0]}
              </TableCell>

              <TableCell className="text-right">

                <Popover>

                  <PopoverTrigger>
                    <MoreHorizontal className="cursor-pointer" />
                  </PopoverTrigger>

                  <PopoverContent className="w-32 bg-white shadow-lg p-2 space-y-1">

                    <div
                      onClick={() =>
                        navigate(`/admin/jobs/${job?._id}/edit`)
                      }
                      className="flex items-center gap-2 w-fit cursor-pointer"
                    >

                      <Edit2 className="w-4" />

                      <span>Edit</span>

                    </div>

                    <div
                      onClick={() =>
                        navigate(`/admin/jobs/${job?._id}/applicants`)
                      }
                      className="flex items-center gap-2 w-fit cursor-pointer mt-2"
                    >
                      <Eye className="w-4" />
                      <span>Applicants</span>
                    </div>

                    <div
                      onClick={() => deleteJobHandler(job?._id)}
                      className="flex items-center gap-2 w-fit cursor-pointer mt-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4" />
                      <span>Delete</span>
                    </div>

                  </PopoverContent>

                </Popover>

              </TableCell>

            </TableRow>

          )))}

        </TableBody>

      </Table>

    </div>
  );
};

export default AdminJobsTable;