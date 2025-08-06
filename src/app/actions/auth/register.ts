"use server";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

interface RegisterPayload {
  email?: string;
  password?: string;
  username?: string;
  role?: "job_seeker" | "recruiter";
}

export const registerUser = async (payload: RegisterPayload) => {
  const { username, email, password, role = "job_seeker" } = payload;
  if (!username || !email || !password) return null;

  const usersCollection = dbConnect(collectionNamesObj.usersCollection);
  const existingUser = await usersCollection.findOne({ email });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      email,
      password: hashedPassword,
      role,
    };
    const result = await usersCollection.insertOne(newUser);
    return {
      insertedId: result.insertedId.toString(),
      acknowledged: result.acknowledged,
    };
  }

  return null;
};
