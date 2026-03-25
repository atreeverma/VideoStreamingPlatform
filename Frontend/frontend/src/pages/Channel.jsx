import { useParams } from "react-router-dom";

function Channel() {
    
    const {username} = useParams();
    return (

        <><h1>Channel Page : {username}</h1></>
    );
}
export default Channel;
