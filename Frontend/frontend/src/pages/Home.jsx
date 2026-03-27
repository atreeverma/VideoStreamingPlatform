import { getAllVideos } from "../api/videoApi";
import { useState,useEffect } from "react"
import VideoCard from "../components/VideoCard.jsx"
function Home() {
    const [videos,setVideos] = useState([])
    useEffect(() => {
        const fetchVideos = async () => {
            try{
                const res = await getAllVideos();
                setVideos(res.data.data)
            } catch (error) {
                console.log("Error fetching videos", error);
            }
        }
        fetchVideos()
    },[])
    return (
         <div>
            <h1>Home</h1>

            {videos.length === 0 ? (
                <p>No videos found</p>
            ) : (
                videos.map((video) => (
                <VideoCard key={video._id} video={video} />
                ))
            )}
        </div>
    );
}
export default Home;