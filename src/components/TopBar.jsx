import {
  Bell,
  BellRing,
  Moon,
  Search,
  Settings,
  Sun,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WeatherWidget from "./WeatherWidget";
import { useApp } from "../context/AppContext";
import { getUnreadNotificationCount } from "../services/notificationService";
import {
  enablePushNotifications,
  listenForLivePushMessages,
} from "../services/pushNotificationService";

function TopBar({ role }) {
  const navigate = useNavigate();
  const { profile, theme, setTheme, t } = useApp();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [unreadCount, setUnreadCount] = useState(0);
  const [pushStatus, setPushStatus] = useState(() => {
    if (!("Notification" in window)) return "unsupported";
    return Notification.permission === "granted" ? "enabled" : "disabled";
  });

  const displayName =
    profile?.name?.trim() ||
    currentUser?.name ||
    (role === "admin" ? "Admin" : "Employee");

  useEffect(() => {
    const loadUnreadCount = async () => {
      if (!currentUser?.uid) return;

      try {
        const count = await getUnreadNotificationCount(currentUser.uid, role);
        setUnreadCount(count);
      } catch (error) {
        console.error("Notification count error:", error);
      }
    };

    loadUnreadCount();

    const interval = setInterval(loadUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [currentUser?.uid, role]);

  useEffect(() => {
    let unsubscribe = null;

    const startForegroundListener = async () => {
      try {
        unsubscribe = await listenForLivePushMessages((payload) => {
          const title =
            payload.notification?.title || "Musthafa Catering Service";
          const body =
            payload.notification?.body || "New shop update received.";

          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(title, {
              body,
              icon: "/profile.png",
            });
          }
        });
      } catch (error) {
        console.error("Foreground notification listener error:", error);
      }
    };

    startForegroundListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleEnablePush = async () => {
    try {
      if (!currentUser?.uid) {
        alert("Please login again.");
        return;
      }

      await enablePushNotifications(currentUser.uid);
      setPushStatus("enabled");
      alert("Lock screen notifications enabled successfully.");
    } catch (error) {
      console.error("Push permission error:", error);
      setPushStatus("disabled");
      alert(error.message || "Failed to enable notifications.");
    }
  };

  return (
    <header className="topbar premium-topbar">
      <div className="topbar-search">
        <Search size={18} />
        <input
          type="text"
          placeholder={
            role === "admin"
              ? "Search employees, stocks, attendance..."
              : "Search notifications, leave, attendance..."
          }
        />
      </div>

      <div className="topbar-actions">
        <WeatherWidget />

        <button
          className="icon-button notification-button"
          title="Notifications"
          onClick={() => navigate("/notifications")}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="notification-badge">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        <button
          className="icon-button notification-button"
          title={
            pushStatus === "enabled"
              ? "Lock screen notifications enabled"
              : "Enable lock screen notifications"
          }
          onClick={handleEnablePush}
          disabled={pushStatus === "unsupported"}
        >
          <BellRing size={18} />
          {pushStatus !== "enabled" && pushStatus !== "unsupported" && (
            <span className="notification-badge">!</span>
          )}
        </button>

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