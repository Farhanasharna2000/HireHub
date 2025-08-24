import {
  Award,
  BarChart3,
  Bookmark,
  Briefcase,
  Building,
  Clock,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Plus,
  Search,
  Shield,
  User,
  Users,
} from "lucide-react";

export const jobSeekersFeatures = [
  {
    icon: Search,
    title: "Search Job Matching",
    description:
      "AI-Powered algorithm matches you with relevant opportunities based on your skills and preferences.",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    description:
      "Create professional resumes with our intuitive builder and template designed by experts.",
  },
  {
    icon: MessageSquare,
    title: "Direct Communication",
    description:
      "Connect directly with hiring managers and recruiters through our secure messaging platform",
  },
  {
    icon: Award,
    title: "Skill Assessment",
    description:
      "Showcase your abilities with verified skill tests and earn badges that employers trust",
  },
];

export const recruiterFeatures = [
  {
    icon: Users,
    title: "Talent Pool Access",
    description:
      "Access our vast database of pre-screened candidates and find the perfect fit for your team.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track your hiring performance with detailed analytics and insights on candidate engagement",
  },
  {
    icon: Shield,
    title: "Verified Candidates",
    description:
      "All candidates undergo background verification to ensure you are hiring trustworthy professionals",
  },
  {
    icon: Clock,
    title: "Quick Hiring",
    description:
      "Streamlined hiring process reduces time-to-hire by 60% with automated screening tools.",
  },
];

//navigation items recruiter
export const NAVIGATION_MENU = [
  { id: "recruiter-dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "post-job", name: "Post Job", icon: Plus },
  { id: "manage-jobs", name: "Manage Jobs", icon: Briefcase },
  { id: "company-profile", name: "Company Profile", icon: Building },
];
//navigation items jobseeker
export const NAVIGATION_MENU_JOBSEEKER = [
  { id: "jobseeker-dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "applied-jobs", name: "Applied Jobs", icon: Briefcase },
  { id: "saved-jobs", name: "Saved Jobs", icon: Bookmark },
  { id: "profile", name: "My Profile", icon: User },
];

//categories and job types
export const CATEGORIES = [
  { value: "Engineering", label: "Engineering" },
  { value: "Design", label: "Design" },
  { value: "Marketing", label: "Marketing" },
  { value: "Sales", label: "Sales" },
  { value: "IT & Software", label: "IT & Software" },
  { value: "Customer Service", label: "Customer Service" },
  { value: "Product", label: "Product" },
  { value: "Operations", label: "Operations" },
  { value: "Finance", label: "Finance" },
  { value: "HR", label: "Human Resources" },
  { value: "Other", label: "Other" },
];

export const JOB_TYPES = [
  { value: "Remote", label: "Remote" },
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
];

export const SALARYRANGES = [
  "Less than $1000",
  "$1000 - $15000",
  "More than $15000",
];
