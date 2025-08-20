export interface Job {
  _id?: string;
  id?: string;
  jobTitle: string;          
  companyName?: string | null; 
  companyLogo?: string  | null;
  status: "Active" | "Closed" ; 
  applicants: number;
  location?: string;
  category?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}