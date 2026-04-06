import { useParams } from "react-router-dom";
import {useEffect, useState} from "react"
import {getUserChannelProfile} from "../api/userApi.js";
import { getAllVideos } from "../api/videoApi";
import VideoCard from "../components/VideoCard";
function Channel() {
    
    const {username} = useParams();
    const [videos,setVideos] = useState([])
    const [channel,setChannel] = useState(null)
    useEffect(() => {
        fetchChannel();
    },[username])
    const fetchChannel = async() => {
        try{
            const res = await getUserChannelProfile(username);
            const channelData = res.data.data
            setChannel(channelData);
            const videoRes = await getAllVideos({userId: channelData._id})
            setVideos(videoRes.data.data);
        } catch (error){
            console.log("Error loading channel", error);
        }
    }
    if (!channel) return <div className="loading">Loading channel...</div>;
    return (
      <div className="channel-page">

            {/* COVER IMAGE */}
            <div className="cover">
                <img src={channel.coverImage} alt="cover" />
            </div>

            {/* PROFILE */}
            <div className="profile">
                <img src={channel.avatar} alt="avatar" className="avatar" />
                <div>
                <h2>{channel.username}</h2>
                <p>{channel.email}</p>
                </div>
            </div>

            {/* VIDEOS */}
            <div className="video-grid">
                {videos.length === 0 ? (
                <p>No videos uploaded</p>
                ) : (
                videos.map((video) => (
                    <VideoCard key={video._id} video={video} />
                ))
                )}
            </div>
        </div>
    );
}
export default Channel;
