import { Worker } from "bullmq"
import connectDB from "../db/index.js"
import { Video } from "../models/video.model.js"

await connectDB()

const connection = {
    url: process.env.REDIS_URL || "redis://localhost:6379",
}

const worker = new Worker(
    "video-processing",
    async (job) => {
        const { videoId } = job.data

        await Video.findByIdAndUpdate(videoId,{
            $set: {
                status: "processing",
            }
        })
        // Placeholder for future transcoding / thumbnail / HLS work
        await new Promise((resolve) => setTimeout(resolve, 3000));

        await Video.findByIdAndUpdate(videoId,{
            $set: {
                status: "published",
                isPublished: true,
            }
        })
        console.log(`Video processing completed for ${videoId}`);
    },{ connection }
)
worker.on("failed",async(job,error) => {
    const videoId = job?.data?.videoId
    if (videoId) {
        await Video.findByIdAndUpdate(videoId, {
            $set: {
                status: "failed",
                processingError: error.message,
            },
        });
    }
    console.error(`Video processing failed for ${videoId}:`, error.message);
})
console.log("Video processing worker started");