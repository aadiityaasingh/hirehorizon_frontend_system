import React, { useState } from "react";
import Navbar from "../Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { JOB_API_END_POINT } from "@/utils/constant";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, PlusCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";

const PostJob = () => {
  useGetAllCompanies();

  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "full-time",
    experience: "",
    position: "",
    companyId: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);

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

    if (!input.companyId) {
      toast.error("Please select a registered company");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${JOB_API_END_POINT}/post`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Job posted successfully!");
        navigate("/admin/jobs");
      }
    } catch (error) {
      console.error("Post job error:", error);
      toast.error(
        error.response?.data?.message || "Job posting failed"
      );
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
              className="flex items-center gap-1.5 text-gray-600 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="font-bold text-2xl text-gray-900 flex items-center gap-2">
                <PlusCircle className="w-6 h-6 text-blue-600" />
                Post a New Job
              </h1>
              <p className="text-sm text-gray-500">
                Publish a job opening to reach thousands of qualified candidates.
              </p>
            </div>
          </div>

          <form onSubmit={submitHandler} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  type="text"
                  name="title"
                  value={input.title}
                  onChange={changeEventHandler}
                  placeholder="e.g. Senior Frontend Developer"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="salary">Salary (LPA)</Label>
                <Input
                  id="salary"
                  type="number"
                  name="salary"
                  value={input.salary}
                  onChange={changeEventHandler}
                  placeholder="e.g. 18"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  name="location"
                  value={input.location}
                  onChange={changeEventHandler}
                  placeholder="e.g. Bangalore or Remote"
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
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div>
                <Label htmlFor="experience">Experience Level (Years)</Label>
                <Input
                  id="experience"
                  type="number"
                  name="experience"
                  value={input.experience}
                  onChange={changeEventHandler}
                  placeholder="e.g. 2"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="position">No. of Positions</Label>
                <Input
                  id="position"
                  type="number"
                  name="position"
                  value={input.position}
                  onChange={changeEventHandler}
                  placeholder="e.g. 2"
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="company">Company</Label>
              {companies?.length > 0 ? (
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select one of your registered companies" />
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
              ) : (
                <p className="text-sm text-red-500 font-medium mt-1">
                  You haven&apos;t registered any company yet. Please register a company first.
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="requirements">Requirements (comma-separated)</Label>
              <Input
                id="requirements"
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                placeholder="React, TypeScript, Next.js, Redux"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Job Description</Label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={input.description}
                onChange={changeEventHandler}
                placeholder="Describe role responsibilities, team environment, and benefits..."
                required
                className="mt-1 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || companies?.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing job...
                </>
              ) : (
                "Post Job Opening"
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PostJob;
