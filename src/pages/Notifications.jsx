import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  CalendarDays,
  CheckCheck,
  Info,
  PartyPopper,
} from "lucide-react";
import Layout from "../components/Layout";
import {
  getNotificationsForUser,
  getReadNotifications,
  markNotificationAsRead,
} from "../services/notificationService";

function getNotificationIcon(type) {
  if (type === "urgent") return AlertTriangle;
  if (type === "warning") return AlertTriangle;
  if (type === "holiday") return PartyPopper;
  return Info;
}

function formatCreatedAt(createdAt) {
  if (!createdAt?.toDate) return "Just now";

  return createdAt.toDate().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function Notifications() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const role = currentUser?.role || "employee";

  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadNotifications = async () => {
    if (!currentUser?.uid) return;

    try {
      setLoading(true);
      setMessage("");

      const notificationData = await getNotificationsForUser(
        currentUser.uid,
        role
      );

      const readData = await getReadNotifications(currentUser.uid);

      setNotifications(notificationData);
      setReadIds(readData);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load notifications. Check Firestore rules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((item) => !readIds.includes(item.id));
    }

    if (filter === "holiday") {
      return notifications.filter((item) => item.type === "holiday");
    }

    if (filter === "urgent") {
      return notifications.filter((item) => item.type === "urgent");
    }

    return notifications;
  }, [filter, notifications, readIds]);

  const unreadCount = notifications.filter(
    (item) => !readIds.includes(item.id)
  ).length;

  const handleMarkRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId, currentUser.uid);
      await loadNotifications();
    } catch (error) {
      console.error(error);
      setMessage("Failed to mark notification as read.");
    }
  };

  return (
    <Layout role={role}>
      <div className="page-header dashboard-hero">
        <div>
          <p className="eyebrow">Notification Center</p>
          <h1>Shop Updates</h1>
          <p>
            View holiday notices, admin announcements, urgent alerts, and shop
            reminders.
          </p>
        </div>

        <div className="hero-mini-card">
          <Bell size={22} />
          <div>
            <span>Unread</span>
            <strong>{unreadCount}</strong>
          </div>
        </div>
      </div>

      <div className="notification-filter-row">
        <button
          type="button"
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          type="button"
          className={filter === "unread" ? "active" : ""}
          onClick={() => setFilter("unread")}
        >
          Unread
        </button>

        <button
          type="button"
          className={filter === "holiday" ? "active" : ""}
          onClick={() => setFilter("holiday")}
        >
          Holiday
        </button>

        <button
          type="button"
          className={filter === "urgent" ? "active" : ""}
          onClick={() => setFilter("urgent")}
        >
          Urgent
        </button>
      </div>

      {message && <p className="form-message">{message}</p>}

      <section className="notification-list-shell">
        {loading ? (
          <p className="empty-text">Loading notifications...</p>
        ) : filteredNotifications.length === 0 ? (
          <p className="empty-text">No notifications found.</p>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const isRead = readIds.includes(notification.id);

            return (
              <article
                className={`notification-card ${notification.type} ${
                  isRead ? "read" : "unread"
                }`}
                key={notification.id}
              >
                <div className="notification-card-icon">
                  <Icon size={22} />
                </div>

                <div className="notification-card-content">
                  <div className="notification-card-head">
                    <div>
                      <h3>{notification.title}</h3>
                      <span>
                        <CalendarDays size={13} />
                        {formatCreatedAt(notification.createdAt)}
                      </span>
                    </div>

                    <span className={`notification-type ${notification.type}`}>
                      {notification.type}
                    </span>
                  </div>

                  <p>{notification.message}</p>

                  {!isRead ? (
                    <button
                      type="button"
                      className="small-btn notification-read-btn"
                      onClick={() => handleMarkRead(notification.id)}
                    >
                      <CheckCheck size={16} />
                      Mark as Read
                    </button>
                  ) : (
                    <span className="read-label">
                      <CheckCheck size={15} />
                      Read
                    </span>
                  )}
                </div>
              </article>
            );
          })
        )}
      </section>
    </Layout>
  );
}

export default Notifications;