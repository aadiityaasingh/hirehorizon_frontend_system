import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";

const JobSetup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  useGetAllCompanies();

  const { companies } = useSelector((store) => store.company);

  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: "",
    companyId: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setFetching(true);
        const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });

        if (res.data.success && res.data.job) {
          const job = res.data.job;
          setInput({
            title: job.title || "",
            description: job.description || "",
            requirements: Array.isArray(job.requirements)
              ? job.requirements.join(", ")
              : job.requirements || "",
            salary: job.salary || "",
            location: job.location || "",
            jobType: job.jobType || "",
            experience: job.experienceLevel || "",
            position: job.position || "",
            companyId: job.company?._id || job.company || "",
          });
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        toast.error(error.response?.data?.message || "Failed to load job details");
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const selectChangeHandler = (value) => {
    setInput({
      ...input,
      companyId: value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.put(
        `${JOB_API_END_POINT}/update/${id}`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Job updated successfully");
        navigate("/admin/jobs");
      }
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error(error.response?.data?.message || "Job update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-4 py-8 flex-1">
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin/jobs")}
              className="flex items-center gap-1.5 text-gray-600"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <h1 className="font-bold text-2xl text-gray-900">Edit Job Listing</h1>
          </div>

          {fetching ? (
            <div className="flex items-center justify-center py-20 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading job details...
            </div>
          ) : (
            <form onSubmit={submitHandler} className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={input.title}
                    onChange={changeEventHandler}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="salary">Salary (LPA)</Label>
                  <Input
                    id="salary"
                    name="salary"
                    type="number"
                    value={input.salary}
                    onChange={changeEventHandler}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={input.location}
                    onChange={changeEventHandler}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="jobType">Job Type</Label>
                  <select
                    id="jobType"
                    name="jobType"
                    value={input.jobType}
                    onChange={changeEventHandler}
                    required
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="experience">Experience Level (Years)</Label>
                  <Input
                    id="experience"
                    name="experience"
                    type="number"
                    value={input.experience}
                    onChange={changeEventHandler}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="position">Number of Positions</Label>
                  <Input
                    id="position"
                    name="position"
                    type="number"
                    value={input.position}
                    onChange={changeEventHandler}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                {companies?.length > 0 && (
                  <Select value={input.companyId} onValueChange={selectChangeHandler}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {companies.map((company) => (
                          <SelectItem key={company?._id} value={company?._id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div>
                <Label htmlFor="requirements">Requirements (comma-separated)</Label>
                <Input
                  id="requirements"
                  name="requirements"
                  value={input.requirements}
                  onChange={changeEventHandler}
                  placeholder="React, Node.js, MongoDB, TypeScript"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Job Description</Label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={input.description}
                  onChange={changeEventHandler}
                  required
                  className="mt-1 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving changes...
                  </>
                ) : (
                  "Update Job"
                )}
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default JobSetup;
