import { useState } from "react";
import {loginUser} from "../api/authApi"
import {useDispatch} from "react-redux"
import { login } from "../features/authSlice"
import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
function Login() {
    const [form,setForm] = useState({email: "",password: ""})
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.email || !form.password) {
            console.log("All fields required");
                return;
        }
        try{
            const res = await loginUser(form)
            dispatch(login(res.data.data.user))
            navigate("/")
        } catch (error) {
            console.log("Login Failed",error);    
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
                placeholder = "Email"
                value={form.email}
                onChange={(e) => setForm({...form,email: e.target.value})}
                />
            <input
                type="password"
                value={form.password}
                placeholder="Password"
                onChange={(e) => setForm({...form,password: e.target.value})}
            />
            <Button type="submit">Login</Button>
        </form>
    );
}
export default Login;