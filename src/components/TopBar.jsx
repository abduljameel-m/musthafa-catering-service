import { Settings, UserRound } from "lucide-react";
import WeatherWidget from "./WeatherWidget";

function TopBar({ role }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <header className="topbar">
      <div className="profile-area">
        <div className="avatar">
          <UserRound size={20} />
        </div>

        <div>
          <p className="profile-name">{currentUser?.name || "User"}</p>
          <span className="profile-role">
            {role === "admin" ? "Administrator" : "Employee"}
          </span>
        </div>

        <button className="icon-button" title="Settings">
          <Settings size={18} />
        </button>
      </div>

      <WeatherWidget />
    </header>
  );
}

export default TopBar;