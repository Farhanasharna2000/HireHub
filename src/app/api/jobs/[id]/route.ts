import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import dbConnect from "@/lib/dbConnect";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!ObjectId.isValid(id as string)) {
    return res.status(400).json({ success: false, error: "Invalid job ID" });
  }

  if (req.method === "PUT") {
    try {
      const jobsCollection = dbConnect("jobs");
      const jobData = req.body;

      const result = await jobsCollection.updateOne(
        { _id: new ObjectId(id as string) },
        { $set: { ...jobData, updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ success: false, error: "Job not found" });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Failed to update job:", error);
      return res.status(500).json({ success: false, error: "Failed to update job." });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
