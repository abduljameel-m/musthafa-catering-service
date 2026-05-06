import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, UserRound } from "lucide-react";
import { users } from "../data/initialData";

function Login() {
  const navigate = useNavigate();

  const [activeRole, setActiveRole] = useState("admin");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleLogin = (role) => {
    setError("");

    const selectedUser = users[role];

    if (
      formData.username === selectedUser.username &&
      formData.password === selectedUser.password
    ) {
      localStorage.setItem("currentUser", JSON.stringify(selectedUser));

      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <main className="login-page">
      <section className="login-hero">
        <p className="brand-tag">Smart Shop Management</p>
        <h1>Musthafa Catering Service</h1>
        <p className="brand-subtitle">
          Manage stocks, attendance, leave requests, and daily shop needs from
          one clean dashboard.
        </p>
      </section>

      <section className="login-card-wrapper">
        <div
          className={`login-choice-card ${
            activeRole === "admin" ? "active-login-card" : ""
          }`}
          onClick={() => setActiveRole("admin")}
        >
          <div className="login-icon admin-icon">
            <ShieldCheck size={30} />
          </div>
          <h2>Admin Login</h2>
          <p>View stocks, approve leave, and mark attendance.</p>
        </div>

        <div
          className={`login-choice-card ${
            activeRole === "employee" ? "active-login-card" : ""
          }`}
          onClick={() => setActiveRole("employee")}
        >
          <div className="login-icon employee-icon">
            <UserRound size={30} />
          </div>
          <h2>Employee Login</h2>
          <p>Update needs, request leave, and view attendance.</p>
        </div>
      </section>

      <section className="login-form-card">
        <h2>{activeRole === "admin" ? "Admin Access" : "Employee Access"}</h2>

        <div className="login-demo-box">
          <p>
            <strong>Demo Username:</strong>{" "}
            {activeRole === "admin" ? "admin" : "employee"}
          </p>
          <p>
            <strong>Demo Password:</strong>{" "}
            {activeRole === "admin" ? "admin123" : "emp123"}
          </p>
        </div>

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && <p className="login-error">{error}</p>}

        <button className="login-button" onClick={() => handleLogin(activeRole)}>
          Login as {activeRole === "admin" ? "Admin" : "Employee"}
        </button>
      </section>

      <footer className="login-footer">
        © 2026 Musthafa Catering Service. All rights reserved by ABDUL JAMEEL M
      </footer>
    </main>
  );
}

export default Login;