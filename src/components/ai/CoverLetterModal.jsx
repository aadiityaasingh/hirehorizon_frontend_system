import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Copy, Download, RefreshCw, Check, FileText } from "lucide-react";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

const CoverLetterModal = ({ open, setOpen, jobId, jobTitle, companyName }) => {
  const [tone, setTone] = useState("Professional");
  const [candidateNotes, setCandidateNotes] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const toneOptions = [
    { label: "Professional & Impactful", value: "Professional" },
    { label: "Technical & Detailed", value: "Technical" },
    { label: "Startup & Fast-Paced", value: "Enthusiastic" },
    { label: "Concise & Executive", value: "Concise" },
  ];

  const generateHandler = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${JOB_API_END_POINT}/${jobId}/generate-cover-letter`,
        { tone, candidateNotes },
        { withCredentials: true }
      );

      if (res.data.success) {
        setCoverLetter(res.data.coverLetter);
        toast.success("AI Cover Letter generated successfully!");
      }
    } catch (error) {
      console.error("Cover letter error:", error);
      toast.error(error.response?.data?.message || "Failed to generate cover letter");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!coverLetter) return;
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    toast.success("Cover letter copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxtFile = () => {
    if (!coverLetter) return;
    const element = document.createElement("a");
    const file = new Blob([coverLetter], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    const safeTitle = (jobTitle || "Job").replace(/[^a-zA-Z0-9]/g, "_");
    element.download = `Cover_Letter_${safeTitle}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Downloaded cover letter as text file");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-tr from-purple-500 to-indigo-600 rounded-lg text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                AI Cover Letter Generator
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                Tailored for <span className="font-semibold text-gray-800">{jobTitle}</span> at{" "}
                <span className="font-semibold text-gray-800">{companyName}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Tone Selector */}
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block mb-2">
              Select Writing Tone
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {toneOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTone(opt.value)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                    tone === opt.value
                      ? "bg-purple-50 border-purple-400 text-purple-700 shadow-xs"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional notes */}
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block mb-1">
              Custom Highlights / Project to Mention (Optional)
            </label>
            <input
              type="text"
              value={candidateNotes}
              onChange={(e) => setCandidateNotes(e.target.value)}
              placeholder="e.g. Led redesign of customer checkout; 3+ years experience with React and Node.js"
              className="w-full text-xs px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          {/* Generate Button if no letter yet */}
          {!coverLetter && (
            <Button
              type="button"
              onClick={generateHandler}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Sparkles className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Analyzing Job & Profile..." : "Generate AI Cover Letter"}</span>
            </Button>
          )}

          {/* Generated Result Container */}
          {coverLetter && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs py-0.5">
                  <Check className="w-3 h-3 mr-1" /> Tailored Cover Letter Ready
                </Badge>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateHandler}
                    disabled={loading}
                    className="h-8 text-xs flex items-center gap-1 border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    <span>Regenerate</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="h-8 text-xs flex items-center gap-1 border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </Button>

                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={downloadTxtFile}
                    className="h-8 text-xs flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .txt</span>
                  </Button>
                </div>
              </div>

              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={12}
                className="w-full text-xs font-mono leading-relaxed p-4 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-y"
              />
              <p className="text-[11px] text-gray-400">
                Tip: You can edit or fine-tune any paragraph before copying or downloading.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoverLetterModal;
