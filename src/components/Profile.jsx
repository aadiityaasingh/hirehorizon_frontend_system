import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen, FileText, Bookmark, Briefcase } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import ApplyJobTable from "./AppliedJobTable";
import SavedJobTable from "./SavedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [activeTab, setActiveTab] = useState("applied");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useGetAppliedJobs();

  const [open, setOpen] = useState(false);

  if (!user) return null;

  const hasResume = user?.profile?.resume;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full px-4 py-8 flex-1">
        {/* User Profile Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <Avatar className="h-20 w-20 md:h-24 md:w-24 border-2 border-blue-100 shadow-sm">
                <AvatarImage src={user?.profile?.profilePhoto || ""} />
                <AvatarFallback className="bg-blue-600 text-white font-bold text-2xl">
                  {user?.fullname?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div>
                <h1 className="font-bold text-2xl text-gray-900">{user?.fullname}</h1>
                <p className="text-gray-500 text-sm mt-0.5">{user?.profile?.bio || "No bio added yet."}</p>
                <Badge variant="outline" className="mt-2 text-xs uppercase tracking-wider text-blue-600 bg-blue-50 border-blue-200">
                  {user?.role}
                </Badge>
              </div>
            </div>

            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 self-end md:self-auto cursor-pointer"
            >
              <Pen className="w-4 h-4 text-gray-600" />
              <span>Edit Profile</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100 text-sm">
            <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <Mail className="w-4 h-4 text-blue-600" />
              <span className="truncate">{user?.email}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <Contact className="w-4 h-4 text-blue-600" />
              <span>{user?.phoneNumber || "No phone added"}</span>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Skills</h2>
            <div className="flex flex-wrap items-center gap-2">
              {user?.profile?.skills?.length > 0 ? (
                user.profile.skills.map((item, index) => (
                  <Badge key={index} className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none font-medium text-xs">
                    {item}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-gray-400">No skills added yet.</span>
              )}
            </div>
          </div>

          {/* Resume Section */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">
              Resume
            </Label>
            {hasResume ? (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={user?.profile?.resume}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100"
              >
                <FileText className="w-4 h-4" />
                <span>{user?.profile?.resumeOriginalName || "View Resume (PDF)"}</span>
              </a>
            ) : (
              <span className="text-xs text-gray-400">No resume uploaded yet. Click edit profile to upload.</span>
            )}
          </div>
        </div>

        {/* Tabbed Activity Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-4 border-b border-gray-200 pb-4 mb-6">
            <button
              onClick={() => setActiveTab("applied")}
              className={`flex items-center gap-2 pb-2 text-base font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === "applied"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Applied Jobs
            </button>

            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-2 pb-2 text-base font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === "saved"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Saved Jobs
            </button>
          </div>

          {activeTab === "applied" ? <ApplyJobTable /> : <SavedJobTable />}
        </div>

        <UpdateProfileDialog open={open} setOpen={setOpen} />
      </main>
    </div>
  );
};

export default Profile;
