import {
  AlertTriangle,
  Boxes,
  CalendarCheck,
  CalendarX,
  ClipboardList,
  IndianRupee,
  PackageCheck,
  ShoppingBag,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import Layout from "../components/Layout";
import SummaryCard from "../components/SummaryCard";
import { getFromStorage } from "../services/storageService";

function AdminDashboard() {
  const stocks = getFromStorage("stocks", []);
  const leaves = getFromStorage("leaveRequests", []);
  const attendance = getFromStorage("attendance", []);

  const lowStockItems = stocks.filter((item) => item.quantity < 5);
  const lowStockCount = lowStockItems.length;
  const pendingLeaves = leaves.filter((leave) => leave.status === "Pending");

  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = attendance.filter((item) => item.date === today);

  const presentToday = todayAttendance.filter(
    (item) => item.status === "Present"
  ).length;

  const absentToday = todayAttendance.filter(
    (item) => item.status === "Absent"
  ).length;

  const totalEmployeesToday = Math.max(presentToday + absentToday, 1);
  const presentPercent = Math.round((presentToday / totalEmployeesToday) * 100);
  const absentPercent = Math.round((absentToday / totalEmployeesToday) * 100);

  const topStocks = stocks.slice(0, 5);
  const latestLeaves = leaves.slice(0, 4);

  return (
    <Layout role="admin">
      <div className="page-header dashboard-hero">
        <div>
          <p className="eyebrow">Admin Panel</p>
          <h1>Good Morning, Admin</h1>
          <p>Here’s what’s happening with Musthafa Catering Service today.</p>
        </div>

        <div className="hero-mini-card">
          <TrendingUp size={22} />
          <div>
            <span>Today’s Overview</span>
            <strong>Live Shop Status</strong>
          </div>
        </div>
      </div>

      <div className="summary-grid dashboard-summary-grid">
        <SummaryCard
          title="Total Orders"
          value="128"
          icon={ShoppingBag}
          type="purple"
        />

        <SummaryCard
          title="Today Revenue"
          value="₹48K"
          icon={IndianRupee}
          type="green"
        />

        <SummaryCard
          title="Stock Items"
          value={stocks.length}
          icon={Boxes}
          type="pink"
        />

        <SummaryCard
          title="Low Stock"
          value={lowStockCount}
          icon={AlertTriangle}
          type="orange"
        />
      </div>

      <div className="dashboard-panels">
        <section className="premium-panel stock-overview-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Inventory</p>
              <h2>Stock Overview</h2>
            </div>
            <PackageCheck size={22} />
          </div>

          <div className="stock-list">
            {topStocks.length === 0 ? (
              <p className="empty-mini">No stock data found.</p>
            ) : (
              topStocks.map((item) => (
                <div className="stock-row" key={item.id}>
                  <div>
                    <h3>{item.name}</h3>
                    <span>
                      {item.quantity < 5 ? "Low stock alert" : "Available"}
                    </span>
                  </div>

                  <strong className={item.quantity < 5 ? "danger-count" : ""}>
                    {item.quantity}
                  </strong>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="premium-panel attendance-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Team</p>
              <h2>Attendance Overview</h2>
            </div>
            <UsersRound size={22} />
          </div>

          <div className="attendance-chart-wrap">
            <div
              className="attendance-ring"
              style={{
                background: `conic-gradient(#22c55e 0 ${presentPercent}%, #ef4444 ${presentPercent}% ${
                  presentPercent + absentPercent
                }%, rgba(255,255,255,0.12) ${
                  presentPercent + absentPercent
                }% 100%)`,
              }}
            >
              <div>
                <strong>{presentToday + absentToday}</strong>
                <span>Marked</span>
              </div>
            </div>

            <div className="attendance-stats">
              <div>
                <span className="dot green-dot"></span>
                <p>Present</p>
                <strong>{presentToday}</strong>
              </div>
              <div>
                <span className="dot red-dot"></span>
                <p>Absent</p>
                <strong>{absentToday}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="premium-panel leave-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Requests</p>
              <h2>Leave Requests</h2>
            </div>
            <ClipboardList size={22} />
          </div>

          <div className="leave-mini-list">
            {latestLeaves.length === 0 ? (
              <p className="empty-mini">No leave requests yet.</p>
            ) : (
              latestLeaves.map((leave) => (
                <div className="leave-mini-row" key={leave.id}>
                  <div>
                    <h3>{leave.employeeName}</h3>
                    <span>{leave.leaveDate}</span>
                  </div>

                  <span
                    className={`mini-status ${
                      leave.status === "Approved"
                        ? "approved"
                        : leave.status === "Rejected"
                        ? "rejected"
                        : "pending"
                    }`}
                  >
                    {leave.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="summary-grid secondary-summary-grid">
        <SummaryCard
          title="Pending Leaves"
          value={pendingLeaves.length}
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
          icon={CalendarX}
          type="red"
        />
        <SummaryCard
          title="Active Staff"
          value={presentToday}
          icon={UsersRound}
          type="purple"
        />
      </div>
    </Layout>
  );
}

export default AdminDashboard;