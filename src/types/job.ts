
export interface Job {
  _id: string ;
  jobTitle: string;
  companyName?: string | null;
  companyLogo?: string | null;
  status: "Active" | "Closed";
  applicants: number;
  location?: string;
  category?: string;
  jobType?: string;
  savedUsers?: string[];
  isApplied?: boolean;
  requirements?: string;
  description?: string;
  salaryMin?: string;
  salaryMax?: string;
  createdAt?: string | Date | undefined;
  updatedAt?: string | Date | undefined;
}

