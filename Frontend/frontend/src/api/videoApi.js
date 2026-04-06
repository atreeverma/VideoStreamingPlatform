import api from "./axios"
export const getAllVideos = () => api.get("/videos")
export const getVideoById = (videoId) => api.get(`/videos/${videoId}`)
export const uploadVideo = (formData) => {
    return api.post("/videos",formData,{
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}
