import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface JobResponse {
  success: boolean;
  id?: string;
  error?: string;
}
export interface JobFormInputs {
  jobTitle: string;
  location: string;
  category: string;
  jobType: string;
  description: string;
  requirements: string;
  salaryMin?: string;
  salaryMax?: string;
}
export const jobsApi = createApi({
  reducerPath: "jobsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    createJob: builder.mutation<JobResponse, JobFormInputs>({
      query: (jobData) => ({
        url: "jobs",
        method: "POST",
        body: jobData,
      }),
    }),
  }),
});

export const { useCreateJobMutation } = jobsApi;
