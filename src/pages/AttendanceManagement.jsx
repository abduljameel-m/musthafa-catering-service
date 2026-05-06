import { useState } from "react";
import Layout from "../components/Layout";
import AttendanceTable from "../components/AttendanceTable";
import { employees } from "../data/initialData";
import { getFromStorage, saveToStorage } from "../services/storageService";
import { getTodayDate } from "../utils/dateUtils";

function AttendanceManagement() {
  const [attendance, setAttendance] = useState(getFromStorage("attendance", []));
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const markAttendance = (employee, status) => {
    const filteredAttendance = attendance.filter(
      (record) =>
        !(record.employeeName === employee.name && record.date === selectedDate)
    );

    const newRecord = {
      id: Date.now(),
      employeeName: employee.name,
      date: selectedDate,
      status,
    };

    const updatedAttendance = [newRecord, ...filteredAttendance];

    setAttendance(updatedAttendance);
    saveToStorage("attendance", updatedAttendance);
  };

  return (
    <Layout role="admin">
      <div className="page-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Attendance Management</h1>
          <p>Only admin can mark employee attendance.</p>
        </div>
      </div>

      <div className="form-card">
        <div className="form-group">
          <label>Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
        </div>

        <div className="employee-attendance-list">
          {employees.map((employee) => (
            <div className="attendance-mark-card" key={employee.id}>
              <div>
                <h3>{employee.name}</h3>
                <p>{employee.username}</p>
              </div>

              <div className="action-row">
                <button
                  className="small-btn success-btn"
                  onClick={() => markAttendance(employee, "Present")}
                >
                  Present
                </button>
                <button
                  className="small-btn danger-btn"
                  onClick={() => markAttendance(employee, "Absent")}
                >
                  Absent
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-title">
        <h2>Attendance Records</h2>
      </div>

      <AttendanceTable attendance={attendance} />
    </Layout>
  );
}

export default AttendanceManagement;