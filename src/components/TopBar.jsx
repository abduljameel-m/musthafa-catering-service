import { Moon, Search, Settings, Sun, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WeatherWidget from "./WeatherWidget";
import { useApp } from "../context/AppContext";

function TopBar({ role }) {
  const navigate = useNavigate();
  const { profile, theme, setTheme, t } = useApp();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const displayName =
    profile?.name?.trim() ||
    currentUser?.name ||
    (role === "admin" ? "Admin" : "Employee");

  return (
    <header className="topbar premium-topbar">
      <div className="topbar-search">
        <Search size={18} />
        <input
          type="text"
          placeholder={
            role === "admin"
              ? "Search stocks, attendance, leave..."
              : "Search shop needs, leave, attendance..."
          }
        />
      </div>

      <div className="topbar-actions">
        <WeatherWidget />

        <button
          className="icon-button theme-topbar-button"
          title={theme === "dark" ? t("lightMode") : t("darkMode")}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          className="icon-button"
          title={t("settings")}
          onClick={() => navigate("/settings")}
        >
          <Settings size={18} />
        </button>

        <div className="profile-area topbar-profile-card">
          <div className="avatar">
            <UserRound size={20} />
          </div>

          <div>
            <p className="profile-name">{displayName}</p>
            <span className="profile-role">
              {role === "admin" ? t("administrator") : t("employee")}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;