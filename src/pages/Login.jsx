import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, ShieldCheck, UserRound } from "lucide-react";
import { users } from "../data/initialData";
import { useApp } from "../context/AppContext";

function Login() {
  const navigate = useNavigate();
  const { t } = useApp();

  const [activeRole, setActiveRole] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleRoleSelect = (role) => {
    setActiveRole(role);
    setFormData({
      username: "",
      password: "",
    });
    setError("");
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const handleLogin = (event) => {
    event.preventDefault();
    setError("");

    const selectedUser = users[activeRole];

    if (
      selectedUser &&
      formData.username === selectedUser.username &&
      formData.password === selectedUser.password
    ) {
      const userToSave = {
        username: selectedUser.username,
        role: selectedUser.role,
        name: selectedUser.name,
      };

      localStorage.setItem("currentUser", JSON.stringify(userToSave));

      if (selectedUser.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/employee", { replace: true });
      }
    } else {
      setError(t("invalidLogin"));
    }
  };

  return (
    <main className="login-page">
      <section className="login-hero">
        <p className="brand-tag">{t("smartShopManagement")}</p>
        <h1>{t("companyName")}</h1>
        <p className="brand-subtitle">{t("loginSubtitle")}</p>
      </section>

      {!activeRole && (
        <section className="login-card-wrapper">
          <div
            className="login-choice-card"
            onClick={() => handleRoleSelect("admin")}
          >
            <div className="login-icon admin-icon">
              <ShieldCheck size={30} />
            </div>
            <h2>{t("adminLogin")}</h2>
            <p>{t("adminLoginDescription")}</p>
          </div>

          <div
            className="login-choice-card"
            onClick={() => handleRoleSelect("employee")}
          >
            <div className="login-icon employee-icon">
              <UserRound size={30} />
            </div>
            <h2>{t("employeeLogin")}</h2>
            <p>{t("employeeLoginDescription")}</p>
          </div>
        </section>
      )}

      {activeRole && (
        <form className="login-form-card" onSubmit={handleLogin}>
          <button
            type="button"
            className="back-role-button"
            onClick={() => setActiveRole(null)}
          >
            <ArrowLeft size={17} />
            {t("back")}
          </button>

          <h2>
            {activeRole === "admin" ? t("adminAccess") : t("employeeAccess")}
          </h2>

          <div className="form-group">
            <label>{t("username")}</label>
            <input
              type="text"
              name="username"
              placeholder={t("enterUsername")}
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label>{t("password")}</label>
            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t("enterPassword")}
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
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

          <button className="login-button" type="submit">
            {activeRole === "admin" ? t("loginAsAdmin") : t("loginAsEmployee")}
          </button>
        </form>
      )}

      <footer className="login-footer">{t("footerRights")}</footer>
    </main>
  );
}

export default Login;