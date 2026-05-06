import { Boxes, CalendarCheck, ClipboardList, AlertTriangle } from "lucide-react";
import Layout from "../components/Layout";
import SummaryCard from "../components/SummaryCard";
import { getFromStorage } from "../services/storageService";

function AdminDashboard() {
  const stocks = getFromStorage("stocks", []);
  const leaves = getFromStorage("leaveRequests", []);
  const attendance = getFromStorage("attendance", []);

  const lowStockCount = stocks.filter((item) => item.quantity < 5).length;
  const pendingLeaves = leaves.filter((leave) => leave.status === "Pending").length;

  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = attendance.filter((item) => item.date === today);
  const presentToday = todayAttendance.filter(
    (item) => item.status === "Present"
  ).length;
  const absentToday = todayAttendance.filter(
    (item) => item.status === "Absent"
  ).length;

  return (
    <Layout role="admin">
      <div className="page-header">
        <div>
          <p className="eyebrow">Admin Panel</p>
          <h1>Welcome back, Admin</h1>
          <p>Monitor your shop stock, leave requests, and attendance.</p>
        </div>
      </div>

      <div className="summary-grid">
        <SummaryCard
          title="Total Stock Items"
          value={stocks.length}
          icon={Boxes}
          type="purple"
        />
        <SummaryCard
          title="Low Stock"
          value={lowStockCount}
          icon={AlertTriangle}
          type="pink"
        />
        <SummaryCard
          title="Pending Leaves"
          value={pendingLeaves}
          icon={ClipboardList}
          type="orange"
        />
        <SummaryCard
          title="Present Today"
          value={presentToday}
          icon={CalendarCheck}
          type="green"
        />
        <SummaryCard
          title="Absent Today"
          value={absentToday}
          icon={CalendarCheck}
          type="red"
        />
      </div>
    </Layout>
  );
}

export default AdminDashboard;