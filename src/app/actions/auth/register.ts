"use server";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

interface RegisterPayload {
  email?: string;
  password?: string;
  username?: string;
  role?: "job_seeker" | "recruiter";
  companyName?: string;
  companyLogo?: string;
}

export const registerUser = async (payload: RegisterPayload) => {
  const { username, email, password, role = "job_seeker", companyName, companyLogo } = payload;

  if (!username || !email || !password) return null;

  if (role === "recruiter" && !companyName) {
    return { error: "Company name is required for recruiters" };
  }

  const usersCollection = dbConnect(collectionNamesObj.usersCollection);

  // Prevent duplicate email
  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    return { error: "Email already exists" };
  }

  // Prevent duplicate company name (only recruiters)
  if (role === "recruiter" && companyName) {
    const existingCompany = await usersCollection.findOne({
      companyName,
      role: "recruiter",
    });
    if (existingCompany) {
      return { error: "Company name already exists" };
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    username,
    email,
    password: hashedPassword,
    role,
    companyName: role === "recruiter" ? companyName : null,
    companyLogo: role === "recruiter" ? companyLogo || null : null, // ✅ save logo
  };

  const result = await usersCollection.insertOne(newUser);

  return {
    insertedId: result.insertedId.toString(),
    acknowledged: result.acknowledged,
  };
};
