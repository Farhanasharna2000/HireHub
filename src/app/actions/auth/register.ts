"use server";

import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

interface RegisterPayload {
  email?: string;
  password?: string;
  username?: string;
}

export const resgisterUser = async (payload: RegisterPayload) => {
  // console.log(payload);
  const usersCollection = dbConnect(collectionNamesObj.usersCollection);
  //validation
  const { username, email, password } = payload;
  if (!username || !email || !password) return null;
  const user = await usersCollection.findOne({ email: payload.email });
  if (!user) {
    const hashedPass = await bcrypt.hash(password, 10);
    payload.password = hashedPass;
    const result = await usersCollection.insertOne(payload);
    // console.log(result);
    const { insertedId, acknowledged } = result;
    return { insertedId: insertedId.toString(), acknowledged };
  }
  return null;
};
