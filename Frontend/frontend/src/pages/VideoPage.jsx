import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideoById } from "../api/videoApi";

function VideoPage() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await getVideoById(videoId);
        setVideo(res.data.data);
      } catch (error) {
        console.log("Error fetching video", error);
      }
    };

    fetchVideo();
  }, [videoId]);

  if (!video) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <video
        src={video.videoFile}
        controls
        width="600"
      />
      <h2>{video.title}</h2>

      <p>Channel: {video.owner?.username}</p>

      <p>{video.description}</p>
    </div>
  );
}

export default VideoPage;