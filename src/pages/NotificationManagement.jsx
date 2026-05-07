import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Bell,
  CalendarDays,
  Megaphone,
  PartyPopper,
  Send,
} from "lucide-react";
import Layout from "../components/Layout";
import { createNotification } from "../services/notificationService";
import { getAllUsers } from "../services/userService";

function NotificationManagement() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    audience: "all",
    targetUid: "",
  });
  const [loading, setLoading] = useState(false);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data.filter((user) => user.status === "active"));
      } catch (error) {
        console.error(error);
      }
    };

    loadUsers();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const quickNotice = (type) => {
    if (type === "holiday") {
      setFormData({
        title: "Shop Holiday Notice",
        message: "Musthafa Catering Service will be closed tomorrow. Please plan accordingly.",
        type: "holiday",
        audience: "employee",
        targetUid: "",
      });
    }

    if (type === "urgent") {
      setFormData({
        title: "Urgent Shop Update",
        message: "Please check the latest shop update immediately.",
        type: "urgent",
        audience: "employee",
        targetUid: "",
      });
    }

    if (type === "stock") {
      setFormData({
        title: "Stock Checking Reminder",
        message: "Please verify all stock items and update the count today.",
        type: "warning",
        audience: "employee",
        targetUid: "",
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessageText("");

    if (!formData.title.trim() || !formData.message.trim()) {
      setMessageText("Please enter title and message.");
      return;
    }

    try {
      setLoading(true);

      await createNotification({
        ...formData,
        createdBy: currentUser?.uid || "",
      });

      setMessageText("Notification sent successfully.");

      setFormData({
        title: "",
        message: "",
        type: "info",
        audience: "all",
        targetUid: "",
      });
    } catch (error) {
      console.error(error);
      setMessageText("Failed to send notification. Check Firestore rules.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout role="admin">
      <div className="page-header dashboard-hero">
        <div>
          <p className="eyebrow">Admin Notice Center</p>
          <h1>Send Notifications</h1>
          <p>
            Send shop updates, holiday notices, urgent messages, and reminders to
            employees.
          </p>
        </div>

        <div className="hero-mini-card">
          <Bell size={22} />
          <div>
            <span>Notice System</span>
            <strong>Live Updates</strong>
          </div>
        </div>
      </div>

      <div className="notification-template-grid">
        <button onClick={() => quickNotice("holiday")}>
          <PartyPopper size={22} />
          <div>
            <h3>Holiday Notice</h3>
            <p>Inform staff about shop holiday.</p>
          </div>
        </button>

        <button onClick={() => quickNotice("urgent")}>
          <AlertTriangle size={22} />
          <div>
            <h3>Urgent Update</h3>
            <p>Send important immediate alert.</p>
          </div>
        </button>

        <button onClick={() => quickNotice("stock")}>
          <CalendarDays size={22} />
          <div>
            <h3>Stock Reminder</h3>
            <p>Ask employees to check stock.</p>
          </div>
        </button>
      </div>

      <section className="notification-compose-shell">
        <div className="panel-header">
          <div>
            <p className="panel-kicker">Compose</p>
            <h2>Create New Notification</h2>
          </div>
          <Megaphone size={22} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="notification-form-grid">
            <div className="form-group">
              <label>Notification Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Example: Shop holiday tomorrow"
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="holiday">Holiday</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label>Audience</label>
              <select
                name="audience"
                value={formData.audience}
                onChange={handleChange}
              >
                <option value="all">All Users</option>
                <option value="employee">Employees Only</option>
                <option value="admin">Admins Only</option>
                <option value="specific">Specific Employee</option>
              </select>
            </div>

            {formData.audience === "specific" && (
              <div className="form-group">
                <label>Select Employee</label>
                <select
                  name="targetUid"
                  value={formData.targetUid}
                  onChange={handleChange}
                >
                  <option value="">Choose employee</option>
                  {users.map((user) => (
                    <option key={user.uid} value={user.uid}>
                      {user.name || user.email || user.phone || user.uid}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group notification-message-field">
              <label>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your announcement here..."
              ></textarea>
            </div>
          </div>

          {messageText && <p className="form-message">{messageText}</p>}

          <button className="primary-btn notification-send-btn" disabled={loading}>
            <Send size={18} />
            {loading ? "Sending..." : "Send Notification"}
          </button>
        </form>
      </section>
    </Layout>
  );
}

export default NotificationManagement;