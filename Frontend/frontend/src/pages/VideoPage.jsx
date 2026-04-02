import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideoById } from "../api/videoApi";
import { getComments, addComments } from "../api/commentApi";
import { toggleLike } from "../api/likeApi";
function VideoPage() {
  const { videoId } = useParams();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [liked,setLiked] = useState(false);
  const [likeCount,setLikeCount] = useState(0);
  useEffect(() => {
    fetchVideo();
    fetchComments();
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      const res = await getVideoById(videoId);
      setVideo(res.data.data);
      setLiked(res.data.data.isLiked || false)
      setLikeCount(res.data.data.likesCount || 0)
    } catch (error) {
      console.log("Error fetching video", error);
    }
  };
  const handleLike = async() => {
    try{
      const res = await toggleLike(videoId);
      setLiked(res.data.data.liked);
      setLikeCount(res.data.data.likeCount);
    } catch (error){
      console.log("Error toggling like",error); 
    }
  }
  const fetchComments = async () => {
    try {
      const res = await getComments(videoId);
      setComments(res.data.data.docs);
    } catch (error) {
      console.log("Error fetching comments", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await addComments(videoId, { content: newComment });
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.log("Error adding comment", error);
    }
  };

  if (!video) return <p className="loading">Loading...</p>;

  return (
    <div className="video-page">

      {/* 🎥 VIDEO SECTION */}
      <div className="video-container">
      {video?.videoFile ? (
        <video
          src={video.videoFile}
          controls
          className="video-player"
        />
      ) : (
        <p className="video-loading">Loading video...</p>
      )}
    </div>

      {/* 📄 VIDEO INFO */}
      <div className="video-info">
        <h2 className="video-title">{video.title}</h2>
        <p className="video-channel">
          Channel: <strong>{video.owner?.username}</strong>
        </p>
        <p className="video-description">{video.description}</p>
      </div>
      <div className="like-section">
        <button
          className={`like-btn ${liked ? "active" : ""}`}
          onClick={handleLike}
        >
          <span className="icon">
            {liked ? "❤️" : "🤍"}
          </span>
          <span>{liked ? "Liked" : "Like"}</span>
        </button>

        <span className="like-count">
          {likeCount} {likeCount === 1 ? "like" : "likes"}
        </span>
      </div>

      {/* 💬 COMMENT INPUT */}
      <div className="comment-input">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleAddComment}>Post</button>
      </div>

      {/* 💬 COMMENTS LIST */}
      <div className="comments-section">
        <h3>Comments</h3>

        {comments.length === 0 ? (
          <p>No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment-card">
              <p className="comment-user">
                {comment.owner?.username}
              </p>
              <p className="comment-text">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default VideoPage;