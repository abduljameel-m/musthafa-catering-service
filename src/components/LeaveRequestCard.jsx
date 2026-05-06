import { formatDate } from "../utils/dateUtils";

function LeaveRequestCard({ request, onApprove, onReject, showActions = false }) {
  return (
    <div className="leave-card">
      <div>
        <h3>{request.employeeName}</h3>
        <p>{formatDate(request.leaveDate)}</p>
        <p className="leave-reason">{request.reason}</p>
      </div>

      <div className="leave-actions">
        <span
          className={`status-badge ${
            request.status === "Approved"
              ? "success"
              : request.status === "Rejected"
              ? "danger"
              : "warning"
          }`}
        >
          {request.status}
        </span>

        {showActions && request.status === "Pending" && (
          <div className="action-row">
            <button className="small-btn success-btn" onClick={onApprove}>
              Approve
            </button>
            <button className="small-btn danger-btn" onClick={onReject}>
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaveRequestCard;