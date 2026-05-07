import { NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  Boxes,
  CalendarCheck,
  ChefHat,
  ClipboardList,
  Home,
  LogOut,
  Megaphone,
  NotebookTabs,
  Settings,
  UsersRound,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { logoutFirebase } from "../firebase/firebase";

function Sidebar({ role }) {
  const navigate = useNavigate();
  const { t } = useApp();

  const adminLinks = [
    { path: "/admin", label: t("dashboard"), icon: Home },
    { path: "/admin/employees", label: "Employees", icon: UsersRound },
    { path: "/admin/notifications", label: "Send Notice", icon: Megaphone },
    { path: "/notifications", label: "Notifications", icon: Bell },
    { path: "/admin/stocks", label: t("stockOverview"), icon: Boxes },
    { path: "/admin/attendance", label: t("attendance"), icon: CalendarCheck },
    { path: "/admin/leaves", label: t("leaveRequests"), icon: ClipboardList },
    { path: "/settings", label: t("settings"), icon: Settings },
  ];

  const employeeLinks = [
    { path: "/employee", label: t("dashboard"), icon: Home },
    { path: "/notifications", label: "Notifications", icon: Bell },
    { path: "/employee/stocks", label: t("shopNeeds"), icon: Boxes },
    { path: "/employee/leave", label: t("applyLeave"), icon: NotebookTabs },
    { path: "/employee/attendance", label: t("attendance"), icon: CalendarCheck },
    { path: "/settings", label: t("settings"), icon: Settings },
  ];

  const links = role === "admin" ? adminLinks : employeeLinks;

  const mobileLinks =
    role === "admin"
      ? [
          { path: "/admin", label: "Home", icon: Home },
          { path: "/admin/employees", label: "Staff", icon: UsersRound },
          { path: "/admin/notifications", label: "Notice", icon: Megaphone },
          { path: "/notifications", label: "Alerts", icon: Bell },
          { path: "/settings", label: "Settings", icon: Settings },
        ]
      : [
          { path: "/employee", label: "Home", icon: Home },
          { path: "/notifications", label: "Alerts", icon: Bell },
          { path: "/employee/stocks", label: "Stock", icon: Boxes },
          { path: "/employee/leave", label: "Leave", icon: NotebookTabs },
          { path: "/settings", label: "Settings", icon: Settings },
        ];

  const handleLogout = async () => {
    try {
      await logoutFirebase();
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <>
      <aside className="sidebar desktop-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">
            <ChefHat size={25} />
          </div>
          <div>
            <h2>MCS</h2>
            <p>{t("smartShopManagement")}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink key={link.path} to={link.path} className="nav-link">
                <Icon size={18} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={18} />
          {t("logout")}
        </button>
      </aside>

      <nav className="mobile-bottom-nav">
        {mobileLinks.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink key={link.path} to={link.path} className="mobile-nav-link">
              <Icon size={19} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}

export default Sidebar;