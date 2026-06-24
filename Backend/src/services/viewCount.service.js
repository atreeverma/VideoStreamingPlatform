import { redis } from "../config/redis.js"

const VIEW_COUNT_KEY = "video:view-counts"//redis hash name where all pending view count are stored

export const incrementVideoView = async(videoId) => {
    return redis.hincrby(VIEW_COUNT_KEY,videoId.toString(),1);
}
export const getPendingViewCounts = async() => {
    return redis.hgetall(VIEW_COUNT_KEY);
}
export const clearVideoViewCount = async (videoId) => {
    return redis.hdel(VIEW_COUNT_KEY,videoId.toString())
}