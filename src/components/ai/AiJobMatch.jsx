import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle2, AlertCircle, ArrowUpRight, Lightbulb, FileText, RefreshCw } from "lucide-react";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import CoverLetterModal from "./CoverLetterModal";
import { useNavigate } from "react-router-dom";

const AiJobMatch = ({ jobId, singleJob, user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [openCoverLetter, setOpenCoverLetter] = useState(false);

  const fetchFitAnalysis = React.useCallback(async () => {
    if (!user || user?.role === "recruiter") return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${JOB_API_END_POINT}/${jobId}/match-score`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setAnalysis(res.data.data || res.data.analysis);
      }
    } catch (err) {
      console.error("Match score error:", err);
      setError("Unable to compute AI match score at this time.");
    } finally {
      setLoading(false);
    }
  }, [jobId, user]);

  useEffect(() => {
    if (jobId && user && user.role !== "recruiter") {
      fetchFitAnalysis();
    }
  }, [jobId, user, fetchFitAnalysis]);

  if (!user) {
    return (
      <div className="my-6 p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">
              See Your AI Resume-Job Match Score
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Sign in as a candidate to get instant match percentage and tailored career recommendations.
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => navigate("/login")}
          className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-4 rounded-lg flex-shrink-0 cursor-pointer"
        >
          Sign In to Analyze
        </Button>
      </div>
    );
  }

  if (user?.role === "recruiter") {
    return null;
  }

  const score = analysis?.matchScore ?? analysis?.score ?? 0;
  const getScoreTheme = (val) => {
    if (val >= 75) {
      return {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-700",
        accent: "from-emerald-500 to-teal-600",
        label: "Outstanding Match",
      };
    }
    if (val >= 50) {
      return {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-700",
        accent: "from-blue-500 to-indigo-600",
        label: "Solid Candidate Fit",
      };
    }
    if (val >= 30) {
      return {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-700",
        accent: "from-amber-500 to-orange-600",
        label: "Moderate Fit",
      };
    }
    return {
      bg: "bg-rose-50",
      border: "border-rose-200",
      text: "text-rose-700",
      accent: "from-rose-500 to-pink-600",
      label: "Skill Growth Opportunity",
    };
  };

  const theme = getScoreTheme(score);

  return (
    <div className="my-6 rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50/40 via-white to-purple-50/20 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-100/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm">
                AI Resume Match & Candidate Fit
              </h3>
              <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700 border-purple-200 py-0">
                Powered by Gemini AI
              </Badge>
            </div>
            <p className="text-[11px] text-gray-500">
              Evaluated against your profile skills & job expectations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={fetchFitAnalysis}
            disabled={loading}
            className="h-8 text-xs border-indigo-200 hover:bg-indigo-50 text-indigo-700 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1 ${loading ? "animate-spin" : ""}`} />
            <span>Re-evaluate</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => setOpenCoverLetter(true)}
            className="h-8 text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white cursor-pointer shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            <span>AI Cover Letter</span>
          </Button>
        </div>
      </div>

      {loading && !analysis ? (
        <div className="py-8 text-center text-xs text-gray-500 flex flex-col items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500 animate-spin" />
          <span>Analyzing your profile against job requirements...</span>
        </div>
      ) : analysis ? (
        <div className="pt-4 space-y-4">
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`p-4 rounded-xl border ${theme.border} ${theme.bg} flex items-center justify-between`}>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Match Score
                </p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-black text-gray-900">{score}%</span>
                  <span className={`text-xs font-bold ${theme.text}`}>{analysis?.fitLevel || theme.label}</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center">
                <span className={`text-sm font-black ${theme.text}`}>{score}%</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-white sm:col-span-2 flex flex-col justify-center">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                Fit Assessment
              </p>
              <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                {analysis.summary || analysis.recommendation}
              </p>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Matched skills */}
            <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-800 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Matched Skills ({analysis.matchedSkills?.length || 0})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysis.matchedSkills?.length > 0 ? (
                  analysis.matchedSkills.map((sk, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="bg-emerald-100/70 text-emerald-800 border-emerald-200 text-[11px] font-medium"
                    >
                      ✓ {sk}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-400 italic text-[11px]">No exact keyword overlap detected</span>
                )}
              </div>
            </div>

            {/* Missing / Recommended skills */}
            <div className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/40">
              <div className="flex items-center gap-1.5 font-semibold text-amber-800 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Recommended to Highlight ({analysis.missingSkills?.length || 0})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysis.missingSkills?.length > 0 ? (
                  analysis.missingSkills.map((sk, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="bg-amber-100/70 text-amber-800 border-amber-200 text-[11px] font-medium"
                    >
                      + {sk}
                    </Badge>
                  ))
                ) : (
                  <span className="text-emerald-700 text-[11px] font-medium">
                    You meet all explicitly listed requirements!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="py-3 text-xs text-rose-600 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      ) : null}

      <CoverLetterModal
        open={openCoverLetter}
        setOpen={setOpenCoverLetter}
        jobId={jobId}
        jobTitle={singleJob?.title}
        companyName={singleJob?.company?.name || "Company"}
      />
    </div>
  );
};

export default AiJobMatch;
