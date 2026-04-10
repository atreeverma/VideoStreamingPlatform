import { useState } from "react";
import { loginUser } from "../api/authApi";
import { useDispatch } from "react-redux";
import { login } from "../features/authSlice";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      console.log("All fields required");
      return;
    }

    try {
      const res = await loginUser(form);
      dispatch(login(res.data.data.user));
      navigate("/");
    } catch (error) {
      console.log("Login Failed", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h2 className="login-title">Welcome Back 👋</h2>
        <p className="login-subtitle">Login to continue</p>

        <form onSubmit={handleSubmit} className="login-form">

          <div className="input-group">
            <label>Email</label>
            <input
              type="text"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <button className="login-btn" type="submit">
            Login
          </button>

        </form>

        <p className="login-footer">
          Don’t have an account? <span>Sign up</span>
        </p>

      </div>
    </div>
  );
}

export default Login;