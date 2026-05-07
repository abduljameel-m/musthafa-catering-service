import { NavLink, useNavigate } from "react-router-dom";
import {
  Boxes,
  CalendarCheck,
  ClipboardList,
  ChefHat,
  Home,
  LogOut,
  NotebookTabs,
  Settings,
} from "lucide-react";
import { useApp } from "../context/AppContext";

function Sidebar({ role }) {
  const navigate = useNavigate();
  const { t } = useApp();

  const adminLinks = [
    { path: "/admin", label: t("dashboard"), icon: Home },
    { path: "/admin/stocks", label: t("stockOverview"), icon: Boxes },
    { path: "/admin/attendance", label: t("attendance"), icon: CalendarCheck },
    { path: "/admin/leaves", label: t("leaveRequests"), icon: ClipboardList },
    { path: "/settings", label: t("settings"), icon: Settings },
  ];

  const employeeLinks = [
    { path: "/employee", label: t("dashboard"), icon: Home },
    { path: "/employee/stocks", label: t("shopNeeds"), icon: Boxes },
    { path: "/employee/leave", label: t("applyLeave"), icon: NotebookTabs },
    { path: "/employee/attendance", label: t("attendance"), icon: CalendarCheck },
    { path: "/settings", label: t("settings"), icon: Settings },
  ];

  const links = role === "admin" ? adminLinks : employeeLinks;

  const handleLogout = () => {
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
        {links.slice(0, 4).map((link) => {
          const Icon = link.icon;

          return (
            <NavLink key={link.path} to={link.path} className="mobile-nav-link">
              <Icon size={19} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}

        <NavLink to="/settings" className="mobile-nav-link">
          <Settings size={19} />
          <span>{t("settings")}</span>
        </NavLink>
      </nav>
    </>
  );
}

export default Sidebar;