import { useNavigate } from "react-router-dom";

function VideoCard({ video }) {
  const navigate = useNavigate();

  return (
    <div
      style={{ border: "1px solid gray", padding: "10px", margin: "10px" }}
      onClick={() => navigate(`/video/${video._id}`)}
    >
      <img
        src={video.thumbnail}
        alt="thumbnail"
        width="200"
      />

      <h3>{video.title}</h3>

      <p>{video.owner?.username}</p>
    </div>
  );
}

export default VideoCard;