import { isValidObjectId } from "mongoose"
import connectDB from "../db/index.js"
import { Video } from "../models/video.model.js"
import {
    getPendingViewCounts,
    clearVideoViewCount
} from "../services/viewCount.service.js"

const flushViewCounts = async () => {
    const counts = await getPendingViewCounts()

    for (const [videoId, count] of Object.entries(counts)) {
        try {
            if (!isValidObjectId(videoId)) {
                await clearVideoViewCount(videoId)
                console.warn(`Skipped invalid video id in Redis: ${videoId}`)
                continue
            }

            const incrementBy = Number(count)

            if (!Number.isFinite(incrementBy) || incrementBy <= 0) {
                await clearVideoViewCount(videoId)
                continue
            }

            await Video.findByIdAndUpdate(videoId, {
                $inc: { views: incrementBy }
            })

            await clearVideoViewCount(videoId)
            console.log(`Flushed ${incrementBy} views for video ${videoId}`)
        } catch (error) {
            console.error(`Failed to flush views for ${videoId}:`, error.message)
        }
    }
}

await connectDB()

setInterval(flushViewCounts, 10000)

console.log("View count worker started")
//docker compose logs -f view-worker