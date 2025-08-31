import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail");

    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "Missing userEmail" },
        { status: 400 }
      );
    }

    const jobsCollection = await dbConnect("jobs");
    const jobs = await jobsCollection.find({ appliedUsers: userEmail }).toArray();

    return NextResponse.json({ success: true, jobs });
  } catch (error) {
    console.error("Failed to fetch applied jobs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch applied jobs" },
      { status: 500 }
    );
  }
}
