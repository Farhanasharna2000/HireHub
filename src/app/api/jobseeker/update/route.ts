import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

interface JobseekerProfile {
  username?: string;
  image?: string;
  bio?: string;
  skills?: string[];
  location?: string;
  resumeUrl?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const usersCollection = await dbConnect("users");
    const { userId, ...profileData } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing user ID" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Enhanced resume URL validation
    if (profileData.resumeUrl) {
      try {
        new URL(profileData.resumeUrl);
        if (!profileData.resumeUrl.startsWith("https://res.cloudinary.com/davrpeomq/raw/upload/")) {
          console.warn("Resume URL may not be a valid Cloudinary raw URL:", profileData.resumeUrl);
          return NextResponse.json(
            { success: false, error: "Resume URL must be a valid Cloudinary raw URL" },
            { status: 400 }
          );
        }
        // Verify the file is accessible and is a PDF
        const res = await fetch(profileData.resumeUrl, { method: "HEAD" });
        if (!res.ok || !res.headers.get("content-type")?.includes("application/pdf")) {
          return NextResponse.json(
            { success: false, error: "Resume URL does not point to a valid PDF" },
            { status: 400 }
          );
        }
      } catch {
        return NextResponse.json(
          { success: false, error: "Invalid resume URL" },
          { status: 400 }
        );
      }
    }

    const updateData: JobseekerProfile = {
      ...profileData,
      updatedAt: new Date(),
    };

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    console.log("Updated user profile:", { userId, resumeUrl: profileData.resumeUrl });
    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}