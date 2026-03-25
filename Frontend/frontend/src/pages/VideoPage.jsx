import React from 'react';
import { useParams } from 'react-router-dom';
function VideoPage() {
    
    const { videoId } = useParams();
    return (
        <><h1>Video Page : {videoId}</h1></>
    );
}
export default VideoPage;