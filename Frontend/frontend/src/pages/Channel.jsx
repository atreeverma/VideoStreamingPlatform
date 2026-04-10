import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserChannelProfile } from "../api/userApi.js";
import { getAllVideos } from "../api/videoApi";
import VideoCard from "../components/VideoCard";
import { toggleSubscription } from "../api/subscriptionApi.js";

function Channel() {
  const { username } = useParams();

  const [videos, setVideos] = useState([]);
  const [channel, setChannel] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [loadingSub, setLoadingSub] = useState(false);

  useEffect(() => {
    fetchChannel();
  }, [username]);

  const fetchChannel = async () => {
    try {
      const res = await getUserChannelProfile(username);
      const channelData = res.data.data;

      setChannel(channelData);

      // ✅ initialize subscription state
      setIsSubscribed(channelData.isSubscribed);
      setSubscriberCount(channelData.subscribersCount);

      const videoRes = await getAllVideos({ userId: channelData._id });
      setVideos(videoRes.data.data);
    } catch (error) {
      console.log("Error loading channel", error);
    }
  };

  const handleSubscribe = async () => {
    if (!channel || loadingSub) return;

    setLoadingSub(true);

    try {
      await toggleSubscription(channel._id);

      // ✅ safe toggle logic
      setIsSubscribed((prev) => {
      const newValue = !prev;

      setSubscriberCount((count) =>
        newValue ? count + 1 : count - 1
      );

      return newValue;
    });

    } catch (error) {
      console.log("Subscription error", error);
    }

    setLoadingSub(false);
  };

  if (!channel) return <div className="loading">Loading channel...</div>;

  return (
    <div className="channel-page">

      {/* COVER */}
      <div className="cover">
        <img src={channel.coverImage} alt="cover" />
      </div>

      {/* PROFILE */}
      <div className="profile">
        <img src={channel.avatar} alt="avatar" className="avatar" />

        <div className="profile-info">
          <h2>{channel.username}</h2>
          <p>{channel.email}</p>

          {/* SUBSCRIBE */}
          <div className="subscribe-section">
            <button
              className={`subscribe-btn ${isSubscribed ? "active" : ""}`}
              onClick={handleSubscribe}
              disabled={loadingSub}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>

            <span>{subscriberCount} subscribers</span>
          </div>
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