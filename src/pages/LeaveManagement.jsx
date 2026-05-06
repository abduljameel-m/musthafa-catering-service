import { useState } from "react";
import Layout from "../components/Layout";
import LeaveRequestCard from "../components/LeaveRequestCard";
import { getFromStorage, saveToStorage } from "../services/storageService";

function LeaveManagement() {
  const [requests, setRequests] = useState(getFromStorage("leaveRequests", []));

  const updateStatus = (id, status) => {
    const updatedRequests = requests.map((request) =>
      request.id === id ? { ...request, status } : request
    );

    setRequests(updatedRequests);
    saveToStorage("leaveRequests", updatedRequests);
  };

  return (
    <Layout role="admin">
      <div className="page-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Leave Requests</h1>
          <p>Approve or reject employee leave requests.</p>
        </div>
      </div>

      <div className="leave-list">
        {requests.length === 0 ? (
          <p className="empty-text">No leave requests found.</p>
        ) : (
          requests.map((request) => (
            <LeaveRequestCard
              key={request.id}
              request={request}
              showActions
              onApprove={() => updateStatus(request.id, "Approved")}
              onReject={() => updateStatus(request.id, "Rejected")}
            />
          ))
        )}
      </div>
    </Layout>
  );
}

export default LeaveManagement;