// app/api/company/update/route.ts
import { NextResponse } from "next/server";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { userId, ...companyData } = await req.json();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" });
    }

    const usersCollection = dbConnect(collectionNamesObj.usersCollection);

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { ...companyData } }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Server error" });
  }
}
