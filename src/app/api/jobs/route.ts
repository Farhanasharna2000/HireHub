import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  try {
    // Get the collection
    const jobsCollection = await dbConnect("jobs");
    
    // Parse the request body
    const jobData = await req.json();
    
    // Insert job data with timestamps
    const result = await jobsCollection.insertOne({
      ...jobData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Failed to insert job:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create job." },
      { status: 500 }
    );
  }
}