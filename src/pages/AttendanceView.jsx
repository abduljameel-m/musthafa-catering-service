import Layout from "../components/Layout";
import AttendanceTable from "../components/AttendanceTable";
import SummaryCard from "../components/SummaryCard";
import { CalendarCheck, CalendarX } from "lucide-react";
import { getFromStorage } from "../services/storageService";

function AttendanceView() {
  const attendance = getFromStorage("attendance", []);

  const presentDays = attendance.filter((item) => item.status === "Present").length;
  const absentDays = attendance.filter((item) => item.status === "Absent").length;

  return (
    <Layout role="employee">
      <div className="page-header">
        <div>
          <p className="eyebrow">Employee</p>
          <h1>My Attendance</h1>
          <p>You can only view attendance marked by admin.</p>
        </div>
      </div>

      <div className="summary-grid">
        <SummaryCard
          title="Present Days"
          value={presentDays}
          icon={CalendarCheck}
          type="green"
        />
        <SummaryCard
          title="Absent Days"
          value={absentDays}
          icon={CalendarX}
          type="red"
        />
      </div>

      <AttendanceTable attendance={attendance} />
    </Layout>
  );
}

export default AttendanceView;