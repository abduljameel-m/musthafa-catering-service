import {
  Boxes,
  CalendarCheck,
  CalendarX,
  ClipboardCheck,
  NotebookTabs,
  PackagePlus,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Layout from "../components/Layout";
import SummaryCard from "../components/SummaryCard";
import { getFromStorage } from "../services/storageService";

function EmployeeDashboard() {
  const stocks = getFromStorage("stocks", []);
  const leaves = getFromStorage("leaveRequests", []);
  const attendance = getFromStorage("attendance", []);

  const presentDays = attendance.filter(
    (item) => item.status === "Present"
  ).length;

  const absentDays = attendance.filter(
    (item) => item.status === "Absent"
  ).length;

  const myLeaves = leaves.length;
  const lowStockItems = stocks.filter((item) => item.quantity < 5);
  const recentStocks = stocks.slice(0, 5);
  const recentLeaves = leaves.slice(0, 4);

  const totalAttendance = Math.max(presentDays + absentDays, 1);
  const presentPercent = Math.round((presentDays / totalAttendance) * 100);

  return (
    <Layout role="employee">
      <div className="page-header dashboard-hero">
        <div>
          <p className="eyebrow">Employee Panel</p>
          <h1>Welcome to Musthafa Catering Service</h1>
          <p>Update daily needs, apply leave, and view attendance records.</p>
        </div>

        <div className="hero-mini-card">
          <Sparkles size={22} />
          <div>
            <span>Today’s Work</span>
            <strong>Stay Updated</strong>
          </div>
        </div>
      </div>

      <div className="summary-grid dashboard-summary-grid">
        <SummaryCard
          title="Shop Need Items"
          value={stocks.length}
          icon={Boxes}
          type="purple"
        />

        <SummaryCard
          title="Low Stock"
          value={lowStockItems.length}
          icon={PackagePlus}
          type="orange"
        />

        <SummaryCard
          title="Leave Requests"
          value={myLeaves}
          icon={NotebookTabs}
          type="pink"
        />

        <SummaryCard
          title="Present Days"
          value={presentDays}
          icon={CalendarCheck}
          type="green"
        />
      </div>

      <div className="dashboard-panels employee-panels">
        <section className="premium-panel stock-overview-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Shop Needs</p>
              <h2>Daily Stock Status</h2>
            </div>
            <ClipboardCheck size={22} />
          </div>

          <div className="stock-list">
            {recentStocks.length === 0 ? (
              <p className="empty-mini">No stock data found.</p>
            ) : (
              recentStocks.map((item) => (
                <div className="stock-row" key={item.id}>
                  <div>
                    <h3>{item.name}</h3>
                    <span>
                      {item.quantity < 5 ? "Need to refill" : "Stock available"}
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
              <p className="panel-kicker">Attendance</p>
              <h2>My Attendance</h2>
            </div>
            <TrendingUp size={22} />
          </div>

          <div className="attendance-chart-wrap">
            <div
              className="attendance-ring"
              style={{
                background: `conic-gradient(#22c55e 0 ${presentPercent}%, #ef4444 ${presentPercent}% 100%)`,
              }}
            >
              <div>
                <strong>{presentPercent}%</strong>
                <span>Present</span>
              </div>
            </div>

            <div className="attendance-stats">
              <div>
                <span className="dot green-dot"></span>
                <p>Present</p>
                <strong>{presentDays}</strong>
              </div>
              <div>
                <span className="dot red-dot"></span>
                <p>Absent</p>
                <strong>{absentDays}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="premium-panel leave-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Leave</p>
              <h2>My Leave Requests</h2>
            </div>
            <NotebookTabs size={22} />
          </div>

          <div className="leave-mini-list">
            {recentLeaves.length === 0 ? (
              <p className="empty-mini">No leave requests yet.</p>
            ) : (
              recentLeaves.map((leave) => (
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
          title="Absent Days"
          value={absentDays}
          icon={CalendarX}
          type="red"
        />
        <SummaryCard
          title="Total Attendance"
          value={presentDays + absentDays}
          icon={CalendarCheck}
          type="green"
        />
        <SummaryCard
          title="Total Leave Requests"
          value={myLeaves}
          icon={NotebookTabs}
          type="pink"
        />
        <SummaryCard
          title="Available Items"
          value={stocks.length - lowStockItems.length}
          icon={Boxes}
          type="purple"
        />
      </div>
    </Layout>
  );
}

export default EmployeeDashboard;