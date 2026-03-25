import {useDispatch} from "react-redux"
import { useEffect } from "react";
import { login } from "./features/authSlice"
import {getCurrentUser} from "./api/authApi"
import { Outlet } from "react-router-dom";
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async() => {
      try{
        const res = await getCurrentUser();
        dispatch(login(res.data.data));
      } catch (error){
        console.log("User is not Logged In",error);    
      }
    }
    fetchUser();
  },[dispatch])
  return (
    <>
      <Outlet/>
    </>  
  )
}

export default App;
