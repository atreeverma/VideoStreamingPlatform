import axios from "axios"
const api = axios.create({
    baseURL: "https://videostreamingplatform-7wc9.onrender.com/api/v1",
    withCredentials: true
})
export default api