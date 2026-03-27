import { Link,useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import {logoutUser} from "../api/authApi"
import { logout } from "../features/authSlice"
import Button from "./Button";
function Navbar() {
    const {user,isAuthenticated} = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleLogout = async () => {
        try{
            await logoutUser();
            dispatch(logout())
            navigate("/login")
        } catch (error) {
            console.log("Logout failed",error);   
        }
    }
    return (
       <nav style={{ display: "flex", gap: "20px", padding: "10px" }}>
            <Link to = "/">MyTube</Link>
            <Link to = "/">Home</Link>
            {isAuthenticated && (
                <>
                    <Link to = "/upload">Upload</Link>
                    <Link to = {`/channel/${user?.username}`}>{user?.username}</Link>
                    <Button onClick = {handleLogout}>Logout</Button>
                </>
            )}
            {!isAuthenticated && (
                <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
                </>
            )}
       </nav>
    );
}
export default Navbar
