import api from "./axios";
export const getComments = (videoId) => api.get(`/comments/${videoId}`);
export const addComments = (videoId,data) => api.post(`/comments/${videoId}`,data)