import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";

const SavedJobTable = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${USER_API_END_POINT}/savedjobs`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setSavedJobs(res.data.savedJobs || []);
      }
    } catch (error) {
      console.error("Fetch saved jobs error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const removeSavedHandler = async (jobId) => {
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/savejob/${jobId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Job removed from saved list");
        setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));
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
      console.error("Remove saved error:", error);
      toast.error(error.response?.data?.message || "Failed to remove saved job");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-gray-500">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading your saved jobs...
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableCaption>A list of jobs you bookmarked for later</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!savedJobs || savedJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                You haven&apos;t saved any jobs yet. Browse listings and click the bookmark icon to save.
              </TableCell>
            </TableRow>
          ) : (
            savedJobs.map((job) => (
              <TableRow key={job?._id}>
                <TableCell className="font-medium text-gray-900">
                  {job?.title}
                </TableCell>
                <TableCell>{job?.company?.name || "Company"}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-purple-600 bg-purple-50">
                    {job?.salary} LPA
                  </Badge>
                </TableCell>
                <TableCell>{job?.location || "India"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/description/${job?._id}`)}
                      className="h-8 text-xs flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeSavedHandler(job?._id)}
                      className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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

export default SavedJobTable;
