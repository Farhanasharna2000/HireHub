"use server";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

interface LoginPayload {
  email?: string;
  password?: string;
}
export const loginUser = async (payload: LoginPayload) => {
  const { email, password } = payload;
  const usersCollection = dbConnect(collectionNamesObj.usersCollection);
  const user = await usersCollection.findOne({ email });
  if (!user || !password) return null;
  const isPasswordOK = await bcrypt.compare(password, user.password);

  if (!isPasswordOK) return null;
  return user;
};
