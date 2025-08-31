"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import HomeLayout from "@/layouts/HomeLayout";
import { useApplyJobMutation, useGetAllJobsQuery } from "@/redux/jobs/jobsApi";
import Loading from "@/app/loading";
import { Clock, MapPin, DollarSign, Users, Star, FileText, X } from "lucide-react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { updateJobseekerProfile } from "@/redux/features/user/userSlice";

interface CustomResume {
  name: string;
  size: string;
  lastUsed: string;
  url?: string;
}

const JobDetailsPage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useGetAllJobsQuery();
  const [open, setOpen] = useState(false);
  const [availability, setAvailability] = useState("immediate");
  const [customResume, setCustomResume] = useState<CustomResume | null>(null);
  const [existingResumeUrl, setExistingResumeUrl] = useState<string>("");
  const [applyJob] = useApplyJobMutation();
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const jobs = data?.jobs || [];
  const job = jobs.find((job) => job._id === id);
  const alreadyApplied = user.email ? job?.appliedUsers?.includes(user.email) : false;

  // Load existing resume from Redux
  useEffect(() => {
    setExistingResumeUrl(user.resumeUrl || "");
  }, [user.resumeUrl]);

  const uploadToCloudinary = async (
    file: File,
    folder: string,
    resourceType: "image" | "raw" = "raw"
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const preset =
      resourceType === "image"
        ? process.env.NEXT_PUBLIC_CLOUDINARY_IMAGE_PRESET || "recruiter_logo_preset"
        : process.env.NEXT_PUBLIC_CLOUDINARY_RESUME_PRESET || "resume_upload_preset";
    formData.append("upload_preset", preset);
    formData.append("folder", folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      { method: "POST", body: formData }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Cloudinary upload failed: ${res.status} - ${errorText}`);
    }

    const result = await res.json();
    if (!result.secure_url) throw new Error("No secure URL returned from Cloudinary");
    return result.secure_url;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF or Word document");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      return;
    }

    try {
      const url = await uploadToCloudinary(file, "resumes", "raw");

      // Update Redux userSlice instantly
      dispatch(updateJobseekerProfile({ resumeUrl: url }));
      setExistingResumeUrl(url);

      // Save as a custom resume (for this application only)
      setCustomResume({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        lastUsed: new Date().toLocaleDateString("en-GB"),
        url,
      });

      toast.success("Resume uploaded!");
    } catch (error) {
      console.error("Resume upload error:", error);
      toast.error("Resume upload failed");
    }
  };

  const removeCustomResume = () => setCustomResume(null);

  const handleApply = async () => {
    if (!user?.email) return toast.error("Please login first!");
    if (user.role !== "job_seeker") return toast.error("Please login as job seeker!");
    setOpen(true);
  };

  const handleSubmitApplication = async () => {
    if (!job) return toast.error("Job not found!");
    try {
      const resumeUrl = customResume?.url || existingResumeUrl || null;
      await applyJob({
        id: job._id,
        userEmail: user.email!,
        availability,
        resume: resumeUrl,
      }).unwrap();

      setOpen(false);
      setAvailability("immediate");
      setCustomResume(null);
      toast.success("Application submitted successfully!");
    } catch {
      toast.error("Failed to submit application. Please try again.");
    }
  };

  const timeAgo = (dateInput: string | Date | undefined) => {
    if (!dateInput) return "Unknown";
    const postedDate = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const diff = Math.floor((new Date().getTime() - postedDate.getTime()) / 1000);
    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? "s" : ""} ago`;
    return postedDate.toLocaleDateString();
  };

  if (isLoading)
    return (
      <HomeLayout>
        <Loading />
      </HomeLayout>
    );

  if (!job)
    return (
      <HomeLayout>
        <div className="min-h-screen flex flex-col justify-center items-center p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Job Not Found</h2>
          <Button onClick={() => router.push("/find-jobs")}>Back to Jobs</Button>
        </div>
      </HomeLayout>
    );
  return (
    <HomeLayout>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto">
          {/* Job details card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
            <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <div className="md:p-8 p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="md:text-2xl text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Job Details
                </h2>
                <Button
                  disabled={alreadyApplied}
                  onClick={handleApply}
                  className={alreadyApplied ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"}
                >
                  {alreadyApplied ? "Applied" : "Apply Now"}
                </Button>
              </div>

              {/* Job info */}
              <div className="flex items-center gap-4 mb-6">
                <Image src={job.companyLogo || "/default-logo.png"} alt="company" width={80} height={80} className="rounded-lg object-cover border" />
                <div>
                  <h1 className="md:text-4xl text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                    {job.jobTitle}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <h3 className="font-medium text-sm md:text-base">{job.companyName}</h3>
                    <MapPin className="size-4 text-blue-500" />
                    <span className="font-medium text-sm md:text-base">{job.location}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-full font-semibold text-xs shadow-lg">
                      <Star className="size-3" /> {job.category}
                    </span>
                    <span className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-2 rounded-full font-semibold text-xs shadow-lg">
                      <Users className="size-3" /> {job.jobType}
                    </span>
                    <span className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-2 rounded-full font-semibold text-xs shadow-lg">
                      <Clock className="size-3" /> Posted {timeAgo(job.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Salary */}
              {(job.salaryMin || job.salaryMax) && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 shadow-sm mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-700 mb-1">Annual Compensation</p>
                      <p className="md:text-2xl text-xl font-bold text-green-800">
                        {job.salaryMin ? `৳${parseInt(job.salaryMin).toLocaleString()}` : "N/A"} - {job.salaryMax ? `৳${parseInt(job.salaryMax).toLocaleString()}` : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Job description */}
              <section className="py-6">
                <h3 className="text-lg font-semibold border-l-4 border-purple-600 pl-3 mb-4">About This Role</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded whitespace-pre-line">{job.description}</p>
              </section>

              {/* Requirements */}
              <section className="py-6">
                <h3 className="text-lg font-semibold border-l-4 border-pink-600 pl-3 mb-4">  What We&apos;re Looking For</h3>
                <p className="text-gray-700 bg-pink-50 p-4 rounded whitespace-pre-line">{job.requirements}</p>
              </section>
            </div>
          </div>
        </div>

        {/* Apply Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md mx-auto p-0 overflow-hidden">
            <DialogHeader className="p-6 pb-4 border-b border-gray-100">
              <DialogTitle className="text-xl font-semibold text-gray-900 cursor-pointer">Apply now</DialogTitle>
            </DialogHeader>
            <div className="p-6 space-y-6">
              {/* Resume Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Your resume</h3>
                  <span className="text-sm text-gray-500">{existingResumeUrl ? "Available" : "Not uploaded"}</span>
                </div>
                {existingResumeUrl ? (
                  <a href={existingResumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Download Resume
                  </a>
                ) : (
                  <p className="text-sm text-gray-600">
                    No resume found. Upload in{" "}
                    <button onClick={() => router.push("/profile")} className="text-blue-600 hover:underline font-medium">
                      your profile
                    </button>
                    .
                  </p>
                )}
              </div>

              {/* Availability */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Confirm your availability</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="availability" value="immediate" checked={availability === "immediate"} onChange={(e) => setAvailability(e.target.value)} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">Yes, I am available immediately</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="availability" value="specify" checked={availability === "specify"} onChange={(e) => setAvailability(e.target.value)} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">No (Specify availability)</span>
                </label>
              </div>

              {/* Custom Resume */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Custom resume</h3>
                  <span className="text-sm text-gray-500">(Optional)</span>
                </div>
                <p className="text-sm text-gray-600">Employer can download this resume</p>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
                  {!customResume ? (
                    <div className="text-center">
                      <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" id="resume-upload" />
                      <label htmlFor="resume-upload" className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium text-sm">
                        Click to upload a custom resume
                      </label>
                      <p className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX (Max 5MB)</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{customResume.name}</p>
                          <p className="text-xs text-gray-500">{customResume.size}</p>
                        </div>
                      </div>
                      <button onClick={removeCustomResume} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                {customResume && <p className="text-xs text-gray-500">Last used on {customResume.lastUsed}</p>}
              </div>

              <Button onClick={handleSubmitApplication} className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium">
                Submit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </HomeLayout>
  );
};

export default JobDetailsPage;
