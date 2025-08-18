"use client";

import JobPostingPreview from "@/components/cards/JobPostingPreview";
import { CATEGORIES, JOB_TYPES } from "@/constants/features";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useCreateJobMutation } from "@/redux/jobs/jobsApi";
import { RootState } from "@/redux/store";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, SubmitHandler, Path, UseFormRegister } from "react-hook-form";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

interface JobFormInputs {
  jobTitle: string;
  location: string;
  category: string;
  jobType: string;
  description: string;
  requirements: string;
  salaryMin?: string;
  salaryMax?: string;
}

interface InputFieldProps<T extends object> {
  label: string;
  id: Path<T>;
  placeholder?: string;
  icon?: React.ElementType;
  register: UseFormRegister<T>;
  error?: string;
  type?: string;
}

const InputField = <T extends object>({
  label,
  id,
  placeholder,
  icon: Icon,
  register,
  error,
  type = "text",
}: InputFieldProps<T>) => (
  <div className="mb-4">
    <label htmlFor={id} className="block font-medium mb-1">
      {label}
    </label>
    <div className="flex items-center border rounded-lg px-3 py-2">
      {Icon && <Icon className="w-5 h-5 mr-2 text-gray-400" />}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register(id, { required: `${label} is required` })}
        className="flex-1 outline-none bg-transparent"
      />
    </div>
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

interface SelectFieldProps<T extends object> {
  label: string;
  id: Path<T>;
  options: { value: string; label: string }[];
  register: UseFormRegister<T>;
  error?: string;
}

const SelectField = <T extends object>({
  label,
  id,
  options,
  register,
  error,
}: SelectFieldProps<T>) => (
  <div className="mb-4">
    <label htmlFor={id} className="block font-medium mb-1">
      {label}
    </label>
    <select
      id={id}
      {...register(id, { required: `${label} is required` })}
      className="w-full border rounded-lg px-3 py-2 bg-white"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

const JobPostingForm: React.FC = () => {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);
 const [createJob, { isLoading }] = useCreateJobMutation();
const user = useSelector((state: RootState) => state.user);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<JobFormInputs>({ mode: "onChange" });

  const formData = watch();

const onSubmit: SubmitHandler<JobFormInputs> = async (data) => {
try {
    const newjobdata = {
      ...data,
      status: "Active",                
      applicants: 0,             
      companyName: user?.companyName,
      companyLogo: user?.companyLogo,  

    };
      const result = await createJob(newjobdata).unwrap(); 

      if (result.success) {
        toast.success("Job posted successfully!");
        router.push("/recruiter-dashboard");
      } else {
        toast.error(result.error || "Failed to post job.");
      }
    } catch {
      toast.error("Network error.");
    }
  };

  if (isPreview) {
    return (
      <DashboardLayout activeMenu="post-job">
        <JobPostingPreview {...formData} onEdit={() => setIsPreview(false)} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="post-job">
      <div className="container mx-auto p-6 bg-white rounded-lg shadow">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Post a New Job</h2>
            <p className="text-gray-600">Fill out the form below to create your job posting</p>
          </div>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            disabled={!isValid}
            className="flex items-center px-4 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            <Eye className="w-5 h-5 mr-1" />
            <span>Preview</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField<JobFormInputs>
            label="Job Title*"
            id="jobTitle"
            placeholder="e.g., Senior Frontend Developer"
            register={register}
            error={errors.jobTitle?.message}
          />

          <InputField<JobFormInputs>
            label="Location"
            id="location"
            placeholder="e.g., New York"
            register={register}
            error={errors.location?.message}
          />

          <SelectField<JobFormInputs>
            label="Category*"
            id="category"
            options={CATEGORIES}
            register={register}
            error={errors.category?.message}
          />

          <SelectField<JobFormInputs>
            label="Job Type*"
            id="jobType"
            options={JOB_TYPES}
            register={register}
            error={errors.jobType?.message}
          />

          <div className="mb-4">
            <label className="block font-medium mb-1">Job Description*</label>
            <textarea
              {...register("description", { required: "Description is required" })}
              className="w-full border rounded-lg px-3 py-2"
              rows={4}
              placeholder="Describe the role and responsibilities..."
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Requirements*</label>
            <textarea
              {...register("requirements", { required: "Requirements are required" })}
              className="w-full border rounded-lg px-3 py-2"
              rows={4}
              placeholder="List key qualifications and skills..."
            />
            {errors.requirements && <p className="text-sm text-red-500 mt-1">{errors.requirements.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField<JobFormInputs>
              label="Minimum Salary"
              id="salaryMin"
              placeholder="e.g., 5000"
              register={register}
              error={errors.salaryMin?.message}
              type="number"
            />
            <InputField<JobFormInputs>
              label="Maximum Salary"
              id="salaryMax"
              placeholder="e.g., 10000"
              register={register}
              error={errors.salaryMax?.message}
              type="number"
            />
          </div>

          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default JobPostingForm;
