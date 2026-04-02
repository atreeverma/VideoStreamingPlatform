import api from "./axios";
export const toggleLike = (videoId) => api.post(`/likes/toggle/v/${videoId}`)
