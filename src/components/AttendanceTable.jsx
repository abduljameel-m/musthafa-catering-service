import { formatDate } from "../utils/dateUtils";

function AttendanceTable({ attendance }) {
  if (!attendance || attendance.length === 0) {
    return <p className="empty-text">No attendance records found.</p>;
  }

  return (
    <div className="table-card">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Employee</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {attendance.map((record) => (
            <tr key={record.id}>
              <td>{formatDate(record.date)}</td>
              <td>{record.employeeName}</td>
              <td>
                <span
                  className={`status-badge ${
                    record.status === "Present" ? "success" : "danger"
                  }`}
                >
                  {record.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceTable;