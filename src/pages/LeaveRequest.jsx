import { useState } from "react";
import Layout from "../components/Layout";
import LeaveRequestCard from "../components/LeaveRequestCard";
import { getFromStorage, saveToStorage } from "../services/storageService";
import { getTodayDate, isLeaveDateValid } from "../utils/dateUtils";

function LeaveRequest() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [leaveDate, setLeaveDate] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState(getFromStorage("leaveRequests", []));

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");

    if (!leaveDate || !reason.trim()) {
      setMessage("Please fill all fields.");
      return;
    }

    if (!isLeaveDateValid(leaveDate)) {
      setMessage("Leave must be applied at least 2 days in advance.");
      return;
    }

    const newRequest = {
      id: Date.now(),
      employeeName: currentUser?.name || "Employee",
      leaveDate,
      reason,
      status: "Pending",
    };

    const updatedRequests = [newRequest, ...requests];

    setRequests(updatedRequests);
    saveToStorage("leaveRequests", updatedRequests);

    setLeaveDate("");
    setReason("");
    setMessage("Leave request submitted successfully.");
  };

  return (
    <Layout role="employee">
      <div className="page-header">
        <div>
          <p className="eyebrow">Employee</p>
          <h1>Apply Leave</h1>
          <p>Leave can be applied only at least 2 days before the leave date.</p>
        </div>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Leave Date</label>
          <input
            type="date"
            min={getTodayDate()}
            value={leaveDate}
            onChange={(event) => setLeaveDate(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Reason</label>
          <textarea
            placeholder="Enter leave reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          ></textarea>
        </div>

        {message && <p className="form-message">{message}</p>}

        <button className="primary-btn">Submit Leave Request</button>
      </form>

      <div className="section-title">
        <h2>My Leave Requests</h2>
      </div>

      <div className="leave-list">
        {requests.length === 0 ? (
          <p className="empty-text">No leave requests found.</p>
        ) : (
          requests.map((request) => (
            <LeaveRequestCard key={request.id} request={request} />
          ))
        )}
      </div>
    </Layout>
  );
}

export default LeaveRequest;