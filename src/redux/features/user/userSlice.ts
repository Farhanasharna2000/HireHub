import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string | null;
  email: string | null;
  username: string | null;
  role: 'job_seeker' | 'recruiter' | null;
  companyName: string | null;
  companyLogo: string | null;
  image: string | null;
  // Jobseeker specific fields
  bio: string | null;
  skills: string[] | null;
  resumeUrl: string | null;
  location: string | null;
  socialLinks: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  } | null;
}

const initialState: UserState = {
  id: null,
  email: null,
  username: null,
  role: null,
  companyName: null,
  companyLogo: null,
  image: null,
  // Initialize jobseeker fields
  bio: null,
  skills: null,
  resumeUrl: null,
  location: null,
  socialLinks: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Partial<UserState>>) {
      return { ...state, ...action.payload };
    },
    clearUser() {
      return initialState;
    },
    updateJobseekerProfile(state, action: PayloadAction<{
      bio?: string;
      skills?: string[];
      resumeUrl?: string;
      location?: string;
      socialLinks?: {
        linkedin?: string;
        github?: string;
        portfolio?: string;
      };
    }>) {
      return { ...state, ...action.payload };
    },
  },
});

export const { setUser, clearUser, updateJobseekerProfile } = userSlice.actions;
export default userSlice.reducer;