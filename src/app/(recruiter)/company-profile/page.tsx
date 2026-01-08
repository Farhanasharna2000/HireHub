"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import {
  Upload,
  X,
  Building2,
  Camera,
  Globe,
  MapPin,
  Calendar,
  Users,
  FileText,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/user/userSlice";
import Image from "next/image";
import Loading from "@/app/loading";

interface CompanyProfileForm {
  companyName: string;
  companyLogo?: string;
  website?: string;
  location?: string;
  description?: string;
  teamSize?: string;
  foundedYear?: number;
}

const teamSizeOptions = [
  { value: "1-10", label: "1-10" },
  { value: "11-50", label: "11-50" },
  { value: "51-200", label: "51-200" },
  { value: "201-500", label: "201-500" },
  { value: "500+", label: "500+" },
];

const CompanyProfilePage = () => {
  const { data: session, update, status } = useSession();
  const dispatch = useDispatch();
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLoading = status === "loading";
  const { register, handleSubmit, setValue, reset } =
    useForm<CompanyProfileForm>({
      defaultValues: {
        companyName: "",
        companyLogo: "",
        website: "",
        location: "",
        description: "",
        teamSize: "",
        foundedYear: undefined,
      },
    });

  // Sync session data into form
  useEffect(() => {
    if (!session?.user) return;
    const u = session.user;
    if (u.companyLogo) {
      setLogoPreview(u.companyLogo);
      setValue("companyLogo", u.companyLogo);
    }
    if (u.companyName) setValue("companyName", u.companyName);
    if (u.website) setValue("website", u.website);
    if (u.location) setValue("location", u.location);
    if (u.description) setValue("description", u.description);
    if (u.teamSize) setValue("teamSize", u.teamSize);
    if (u.foundedYear) setValue("foundedYear", u.foundedYear);
  }, [session, setValue]);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const data = new FormData();
    data.append("file", file);
    data.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_IMAGE_PRESET || ""
    );
    data.append("folder", "company-logos");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: data }
    );
    const result = await res.json();
    return result.secure_url;
  };

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setUploadingLogo(true);
    try {
      const logoUrl = await uploadToCloudinary(file);
      setValue("companyLogo", logoUrl);
      setLogoPreview(logoUrl);
      toast.success("Logo uploaded successfully!");
    } catch {
      toast.error("Failed to upload logo. Try again.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const removeLogo = () => {
    setValue("companyLogo", "");
    setLogoPreview("");
  };

  const onSubmit = async (data: CompanyProfileForm) => {
    if (!session?.user?.id) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/company/update", {
        method: "POST",
        body: JSON.stringify({
          userId: session.user.id,
          ...data,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (result.success) {
        // update Redux
        dispatch(
          setUser({
            id: session.user.id,
            email: session.user.email || null,
            username: session.user.username || null,
            role: session.user.role as "job_seeker" | "recruiter",
            companyName: data.companyName,
            companyLogo: data.companyLogo || null,
          })
        );

        //  update NextAuth session too
        await update({
          companyName: data.companyName,
          companyLogo: data.companyLogo || null,
          website: data.website || "",
          location: data.location || "",
          description: data.description || "",
          teamSize: data.teamSize || "",
          foundedYear: data.foundedYear || undefined,
        });

        reset({ ...data });
        setLogoPreview(data.companyLogo || "");
        toast.success("Company profile updated!");
      } else {
        toast.error(result.error || "Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout activeMenu="company-profile">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="conatiner mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Company Profile
            </h1>
            <p className="text-gray-600 text-lg">
              Build your company&apos;s professional presence
            </p>
          </div>

          <div className="space-y-8">
            {/* Company Logo Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Company Identity
                </h2>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Company Logo
                  </label>

                  {!logoPreview ? (
                    <div className="relative group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={uploadingLogo}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className={`relative w-full h-48 border-3 border-dashed border-gray-300 rounded-xl cursor-pointer flex flex-col items-center justify-center transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 group-hover:shadow-lg ${
                          uploadingLogo ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <div className="text-center">
                          {uploadingLogo ? (
                            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                          ) : (
                            <Upload className="mx-auto mb-4 text-gray-400 w-12 h-12 group-hover:text-blue-500 transition-colors" />
                          )}
                          <p className="text-lg font-medium text-gray-600 group-hover:text-blue-600">
                            {uploadingLogo
                              ? "Uploading..."
                              : "Upload Company Logo"}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            PNG, JPG up to 5MB
                          </p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="relative group w-48 h-48 mx-auto lg:mx-0 overflow-hidden shadow-lg rounded-lg">
                      <Image
                        src={logoPreview}
                        alt="Company Logo"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-md"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Company Name *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      {...register("companyName", { required: true })}
                      placeholder="Enter your company name"
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Company Details
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Company Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="url"
                      {...register("website")}
                      placeholder="https://yourcompany.com"
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      {...register("location")}
                      placeholder="City, Country"
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Founded Year
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      {...register("foundedYear")}
                      placeholder="e.g. 2015"
                      min={1800}
                      max={new Date().getFullYear()}
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Team Size
                  </label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                    <select
                      {...register("teamSize")}
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                    >
                      <option value="">Select team size</option>
                      {teamSizeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Company Description
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Tell us about your company, culture, mission, and what makes you unique..."
                  rows={6}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-12 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3"
              >
                {isSubmitting ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <Check className="w-5 h-5" />
                )}
                {isSubmitting ? "Saving Changes..." : "Save Company Profile"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CompanyProfilePage;
