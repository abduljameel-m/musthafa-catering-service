import { Settings, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WeatherWidget from "./WeatherWidget";
import { useApp } from "../context/AppContext";

function TopBar({ role }) {
  const navigate = useNavigate();
  const { profile, t } = useApp();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const displayName =
    profile?.name?.trim() || currentUser?.name || (role === "admin" ? "Admin" : "Employee");

  return (
    <header className="topbar">
      <div className="profile-area">
        <div className="avatar">
          <UserRound size={20} />
        </div>

        <div>
          <p className="profile-name">{displayName}</p>
          <span className="profile-role">
            {role === "admin" ? "Administrator" : "Employee"}
          </span>
        </div>

        <button
          className="icon-button"
          title={t("settings")}
          onClick={() => navigate("/settings")}
        >
          <Settings size={18} />
        </button>
      </div>

      <WeatherWidget />
    </header>
  );
}

export default TopBar;