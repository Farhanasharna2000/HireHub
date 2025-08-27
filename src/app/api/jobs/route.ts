import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

interface Job {
  title: string;
  companyName: string;
  companyLogo: string;
  status: "Active" | "Closed";
  applicants: number;
  location?: string;
  category?: string;
  createdAt: string | Date | undefined;
  updatedAt: string | Date | undefined;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const companyName = searchParams.get("companyName");
    const mode = searchParams.get("mode"); // new param for distinct

    const jobsCollection = await dbConnect("jobs");

    if (mode === "companies") {
      //  Return all unique company names
      const companies = await jobsCollection.distinct("companyName", {
        companyName: { $ne: null },
      });
      return NextResponse.json({ success: true, companies });
    }

    //  Existing logic for fetching jobs (unchanged)
    const query: Partial<Job> = {};
    if (companyName) {
      query.companyName = companyName; // filter by company
    }

    const jobs = await jobsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, jobs });
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch jobs." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const jobsCollection = await dbConnect("jobs");

    const jobData = await req.json();

    const result = await jobsCollection.insertOne({
      ...jobData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { success: true, id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to insert job:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create job." },
      { status: 500 }
    );
  }
}

// PATCH: Toggle saved job for a specific user
export async function PATCH(req: NextRequest) {
  try {
    const jobsCollection = await dbConnect("jobs");
    const body = await req.json();
    const { id, userEmail, status } = body; // get user's email

    if (!id || !userEmail) {
      return NextResponse.json(
        { success: false, error: "Missing job id or user email" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid job ID format" },
        { status: 400 }
      );
    }

    const job = await jobsCollection.findOne({ _id: new ObjectId(id) });
    if (!job)
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 }
      );

    let updatedSavedUsers: string[] = job.savedUsers || [];

    if (updatedSavedUsers.includes(userEmail)) {
      updatedSavedUsers = updatedSavedUsers.filter(
        (email) => email !== userEmail
      );
    } else {
      updatedSavedUsers.push(userEmail);
    }

    const updateFields: Partial<Job> & { savedUsers: string[] } = {
      savedUsers: updatedSavedUsers,
      updatedAt: new Date(),
    };

    if (status) updateFields.status = status;

    await jobsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    return NextResponse.json({ success: true, savedUsers: updatedSavedUsers });
  } catch (error) {
    console.error("Failed to update job:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update job" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const jobsCollection = await dbConnect("jobs");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing id" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid job ID format" },
        { status: 400 }
      );
    }

    const result = await jobsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Failed to delete job:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
