export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string;
  testimonial: string;
  rating: number;
  userType: 'recruiter' | 'jobseeker';
  avatar: string;
}
