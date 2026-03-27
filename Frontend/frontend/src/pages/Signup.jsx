import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import {login} from "../features/authSlice"
function Signup() {
    const [form,setForm] = useState({
        fullname: "",
        email: "",
        username: "",
        password: "",
    })
    const [files,setFiles] = useState({
        avatar: null,
        coverImage: null
    })
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(
            !form.fullname || !form.email || !form.username || !form.password || !files.avatar
        ){
            console.log("All required fields must be filled");
        }

        try{
            const formData = new FormData()
            formData.append("fullname", form.fullname);
            formData.append("email", form.email);
            formData.append("username", form.username);
            formData.append("password", form.password);
            formData.append("avatar", files.avatar);
            if (files.coverImage) {
                formData.append("coverImage", files.coverImage);
            }
            await registerUser(formData)
            console.log("Signup successfull");
            navigate("/")
            
        } catch (error) {
            console.log("Signup failed",error);
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <h2>Signup</h2>
            <input  
                value={form.fullname}
                placeholder = "Fullname"
                onChange={(e) => setForm({...form,fullname: e.target.value})}
            />
            <input  
                value={form.email}
                placeholder = "Email"
                onChange={(e) => setForm({...form,email: e.target.value})}
            />
            <input  
                value={form.username}
                placeholder = "Username"
                onChange={(e) => setForm({...form,username: e.target.value})}
            />
            <input  
                type="password"
                value={form.password}
                placeholder = "Password"
                onChange={(e) => setForm({...form,password: e.target.value})}
            />
            <div>
                <label>Avatar (required)</label>
                <input
                    type="file"
                    onChange={(e) => setFiles({...files,avatar: e.target.files[0]})}
                />
            </div>
            <div>
                <label>CoverImage (optional)</label>
                <input
                    type="file"
                    onChange={(e) => setFiles({...files,coverImage: e.target.files[0]})}
                />
            </div>
        <button type="submit">SignUp</button>
        </form>
    );
}
export default Signup;