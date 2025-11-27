import React, { use, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, getUser } from "../api/auth";

export default function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData.email, formData.password);
      if (response.data.status === 200) {
        // prefer role included in login response
        const roleFromLogin = response.data.data?.user?.role || response.data.user?.role || response.data.role;
        let role = roleFromLogin;
        if (!role) {
          // fallback to fetching user
          try {
            const userRes = await getUser();
            role = userRes.data.data?.user?.role || userRes.data.user?.role || userRes.data.role;
          } catch (err) {
            // leave role undefined
          }
        }

        if (role === "guidance" || role === "counselor") {
          navigate("/guidance/dashboard");
        } else if (role === "student") {
          navigate("/student/dashboard");
        } else {
          navigate("/cars");
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        name="email"
        placeholder="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        placeholder="Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Logins</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
