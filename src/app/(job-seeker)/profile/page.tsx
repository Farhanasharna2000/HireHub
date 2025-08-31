"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Camera,
  Upload,
  X,
  Check,
  User,
  Link,
  Github,
  Linkedin,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { updateJobseekerProfile } from "@/redux/features/user/userSlice";
import Image from "next/image";
import Loading from "@/app/loading";
import { RootState } from "@/redux/store";

interface JobseekerForm {
  username: string;
  image?: string;
  bio?: string;
  skills: { value: string }[];
  location?: string;
  resumeUrl?: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
}

const JobseekerProfilePage = () => {
  const { data: session, update, status } = useSession();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const isLoading = status === "loading";
  const [imagePreview, setImagePreview] = useState<string>("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [existingResumeUrl, setExistingResumeUrl] = useState<string>("");

  const { register, handleSubmit, setValue, control } = useForm<JobseekerForm>({
    defaultValues: {
      username: "",
      image: "",
      bio: "",
      skills: [{ value: "" }],
      location: "",
      resumeUrl: "",
      socialLinks: {
        linkedin: "",
        github: "",
        portfolio: "",
      },
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "skills" });

  // Sync form with Redux & session
  useEffect(() => {
    if (!user) return;

    setValue("username", user.username || "");
    setValue("bio", user.bio || "");
    setValue("location", user.location || "");
    setValue("image", user.image || "");
    setValue("resumeUrl", user.resumeUrl || "");
    setValue("socialLinks", user.socialLinks || {});
    setValue(
      "skills",
      user.skills?.map((s: string) => ({ value: s })) || [{ value: "" }]
    );

    setImagePreview(user.image || "");
    setExistingResumeUrl(user.resumeUrl || "");
  }, [user, setValue]);

  // Cloudinary uploader
  const uploadToCloudinary = async (file: File, folder: string, type: "image" | "raw") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      type === "image"
        ? process.env.NEXT_PUBLIC_CLOUDINARY_IMAGE_PRESET || "recruiter_logo_preset"
        : process.env.NEXT_PUBLIC_CLOUDINARY_RESUME_PRESET || "resume_upload_preset"
    );
    formData.append("folder", folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${type}/upload`,
      { method: "POST", body: formData }
    );
    const result = await res.json();
    if (!result.secure_url) throw new Error("Cloudinary upload failed");
    return result.secure_url;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Invalid image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image too large");

    try {
      const url = await uploadToCloudinary(file, "images", "image");
      setImagePreview(url);
      setValue("image", url);
      toast.success("Profile image uploaded!");
    } catch {
      toast.error("Image upload failed");
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) return toast.error("Invalid resume format");
    if (file.size > 5 * 1024 * 1024) return toast.error("Resume too large");

    try {
      const url = await uploadToCloudinary(file, "resumes", "raw");
      setResumeFile(file);
      setExistingResumeUrl(url);
      setValue("resumeUrl", url);
      toast.success("Resume uploaded!");
    } catch {
      toast.error("Resume upload failed");
    }
  };

  const onSubmit = async (data: JobseekerForm) => {
    if (!session?.user?.id) return toast.error("Not authenticated");

    const filteredSkills = data.skills.map((s) => s.value.trim()).filter(Boolean);
    const profileData = { ...data, skills: filteredSkills };

    try {
      const res = await fetch("/api/jobseeker/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, ...profileData }),
      });
      const result = await res.json();
      if (!result.success) return toast.error(result.error || "Update failed");

      dispatch(updateJobseekerProfile({ ...profileData }));
      await update({ ...profileData });
      toast.success("Profile updated!");
    } catch {
      toast.error("Something went wrong");
    }
  };
  
  return (
    <DashboardLayout activeMenu="profile">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Jobseeker Profile</h1>
            <p className="text-gray-500">
              Build your career profile to attract recruiters
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div>
                    <label className="block font-medium mb-2">
                      Profile Picture
                    </label>
                    {!imagePreview ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Camera className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                          file:border-0 file:text-sm file:font-semibold 
                          file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                    ) : (
                      <div className="relative size-40">
                        <Image
                          src={imagePreview}
                          alt="Image"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview("");
                            setValue("image", "");
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block font-medium my-2">Bio</label>
                    <textarea
                      {...register("bio")}
                      rows={4}
                      className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell recruiters about yourself, your experience, and career goals..."
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium mb-2">
                      Username *
                    </label>
                    <input
                      {...register("username", {
                        required: "Full name is required",
                      })}
                      className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Email</label>
                    <input
                      value={session?.user?.email || ""}
                      readOnly
                      className="w-full border rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Location</label>
                    <input
                      {...register("location")}
                      className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Skills</h2>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      {...register(`skills.${index}.value` as const)}
                      placeholder="Enter a skill"
                      className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => append({ value: "" })}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  + Add Skill
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Resume
              </h2>
              <div className="space-y-4">
                {existingResumeUrl ? (
                  <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <a
                      href={existingResumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                      onClick={() => console.log("Opening resume URL:", existingResumeUrl)}
                    >
                      View Current Resume
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setExistingResumeUrl("");
                        setValue("resumeUrl", "");
                        setResumeFile(null);
                      }}
                      className="ml-auto text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block font-medium mb-2">
                        Upload Resume
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                      {resumeFile && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ {resumeFile.name} uploaded
                        </p>
                      )}
                    </div>
                    <div className="text-center text-gray-500">OR</div>
                    <div>
                      <label className="block font-medium mb-2">Resume URL</label>
                      <input
                        {...register("resumeUrl")}
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Paste link to your resume (Google Drive, Dropbox, etc.)"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Link className="w-5 h-5" />
                Social Links & Portfolio
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium mb-2 flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-blue-600" />
                    LinkedIn Profile
                  </label>
                  <input
                    {...register("socialLinks.linkedin")}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div>
                  <label className="font-medium mb-2 flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    GitHub Profile
                  </label>
                  <input
                    {...register("socialLinks.github")}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="font-medium mb-2 flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    Portfolio Website
                  </label>
                  <input
                    {...register("socialLinks.portfolio")}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center pb-8">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-xl flex items-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
              >
                <Check className="w-5 h-5" /> Save Profile
              </button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
};

export default JobseekerProfilePage;