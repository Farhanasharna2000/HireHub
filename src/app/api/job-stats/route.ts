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

    // Count applied jobs
    const appliedJobsCount = await jobsCollection.countDocuments({
      appliedUsers: userEmail,
    });

    // Count saved jobs
    const savedJobsCount = await jobsCollection.countDocuments({
      savedUsers: userEmail,
    });

    // Interviews count (for now fixed to 0)
    const interviewsCount = 0;

    return NextResponse.json({
      success: true,
      stats: {
        appliedJobs: appliedJobsCount,
        savedJobs: savedJobsCount,
        interviews: interviewsCount,
      },
    });
  } catch (error) {
    console.error("Failed to fetch job stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch job stats" },
      { status: 500 }
    );
  }
}
