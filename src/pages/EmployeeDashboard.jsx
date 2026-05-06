import { Boxes, CalendarCheck, NotebookTabs } from "lucide-react";
import Layout from "../components/Layout";
import SummaryCard from "../components/SummaryCard";
import { getFromStorage } from "../services/storageService";

function EmployeeDashboard() {
  const stocks = getFromStorage("stocks", []);
  const leaves = getFromStorage("leaveRequests", []);
  const attendance = getFromStorage("attendance", []);

  const presentDays = attendance.filter((item) => item.status === "Present").length;
  const absentDays = attendance.filter((item) => item.status === "Absent").length;
  const myLeaves = leaves.length;

  return (
    <Layout role="employee">
      <div className="page-header">
        <div>
          <p className="eyebrow">Employee Panel</p>
          <h1>Welcome to Musthafa Catering Service</h1>
          <p>Update daily needs, apply leave, and view attendance records.</p>
        </div>
      </div>

      <div className="summary-grid">
        <SummaryCard
          title="Shop Need Items"
          value={stocks.length}
          icon={Boxes}
          type="purple"
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
        <SummaryCard
          title="Absent Days"
          value={absentDays}
          icon={CalendarCheck}
          type="red"
        />
      </div>
    </Layout>
  );
}

export default EmployeeDashboard;