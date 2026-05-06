import { NavLink, useNavigate } from "react-router-dom";
import {
  Boxes,
  CalendarCheck,
  ClipboardList,
  Home,
  LogOut,
  NotebookTabs,
} from "lucide-react";

function Sidebar({ role }) {
  const navigate = useNavigate();

  const adminLinks = [
    { path: "/admin", label: "Dashboard", icon: Home },
    { path: "/admin/stocks", label: "Stock Overview", icon: Boxes },
    { path: "/admin/attendance", label: "Attendance", icon: CalendarCheck },
    { path: "/admin/leaves", label: "Leave Requests", icon: ClipboardList },
  ];

  const employeeLinks = [
    { path: "/employee", label: "Dashboard", icon: Home },
    { path: "/employee/stocks", label: "Shop Needs", icon: Boxes },
    { path: "/employee/leave", label: "Apply Leave", icon: NotebookTabs },
    { path: "/employee/attendance", label: "Attendance", icon: CalendarCheck },
  ];

  const links = role === "admin" ? adminLinks : employeeLinks;

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">M</div>
        <div>
          <h2>MCS</h2>
          <p>Shop Manager</p>
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
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;