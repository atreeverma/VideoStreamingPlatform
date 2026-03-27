import api from "./axios"
export const getAllVideos = () => api.get("/videos")
export const getVideoById = (videoId) => api.get(`/videos/${videoId}`)
