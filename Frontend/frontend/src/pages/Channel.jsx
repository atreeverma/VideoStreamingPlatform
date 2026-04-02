import { useParams } from "react-router-dom";
import {useEffect, useState} from "react"
import getChannelProfile from "../api/userApi";
function Channel() {
    
    const {username} = useParams();
    const [videos,setVideos] = useState([])
    const [channel,setChannel] = useState(null)
    useEffect(() => {
        fetchChannel();
    },[username])
    const fetchChannel = async() => {
        try{
            const res = await getChannelProfile(username);
            setChannel(res.data.data);
        } catch (error){

        }
    }
    
    return (

        <><h1>Channel Page : {username}</h1></>
    );
}
export default Channel;
