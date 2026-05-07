import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Ban,
  Mail,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import Layout from "../components/Layout";
import {
  getAllUsers,
  updateUserDetails,
  updateUserRole,
  updateUserStatus,
} from "../services/userService";

function EmployeeManagement() {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load users. Check Firestore rules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const text = searchText.toLowerCase().trim();

    if (!text) return users;

    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(text) ||
        user.email?.toLowerCase().includes(text) ||
        user.phone?.toLowerCase().includes(text) ||
        user.role?.toLowerCase().includes(text) ||
        user.status?.toLowerCase().includes(text)
      );
    });
  }, [users, searchText]);

  const pendingCount = users.filter((user) => user.status === "pending").length;
  const activeCount = users.filter((user) => user.status === "active").length;
  const blockedCount = users.filter((user) => user.status === "blocked").length;

  const openEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      dob: user.dob || "",
      address: user.address || "",
    });
    setMessage("");
  };

  const handleEditChange = (event) => {
    setEditForm({
      ...editForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleSaveDetails = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      await updateUserDetails(selectedUser.uid, editForm);
      setMessage("Employee details updated successfully.");
      await loadUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error(error);
      setMessage("Failed to update employee details.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (user, status) => {
    try {
      setLoading(true);
      await updateUserStatus(user.uid, status);
      setMessage(`User ${status} successfully.`);
      await loadUsers();
    } catch (error) {
      console.error(error);
      setMessage("Failed to update user status.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (user, role) => {
    try {
      setLoading(true);
      await updateUserRole(user.uid, role);
      setMessage(`Role changed to ${role}.`);
      await loadUsers();
    } catch (error) {
      console.error(error);
      setMessage("Failed to update role.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout role="admin">
      <div className="page-header dashboard-hero">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Employee Management</h1>
          <p>
            Approve new users, manage roles, block accounts, and maintain employee
            details.
          </p>
        </div>

        <div className="hero-mini-card">
          <UsersRound size={22} />
          <div>
            <span>Total Users</span>
            <strong>{users.length}</strong>
          </div>
        </div>
      </div>

      <div className="employee-stats-grid">
        <div className="employee-stat-card">
          <BadgeCheck size={22} />
          <div>
            <p>Active Users</p>
            <h3>{activeCount}</h3>
          </div>
        </div>

        <div className="employee-stat-card warning">
          <RefreshCw size={22} />
          <div>
            <p>Pending Approval</p>
            <h3>{pendingCount}</h3>
          </div>
        </div>

        <div className="employee-stat-card danger">
          <Ban size={22} />
          <div>
            <p>Blocked Users</p>
            <h3>{blockedCount}</h3>
          </div>
        </div>
      </div>

      <section className="employee-management-shell">
        <div className="employee-toolbar">
          <div className="employee-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name, email, phone, role, status..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
          </div>

          <button className="primary-btn employee-refresh-btn" onClick={loadUsers}>
            <RefreshCw size={18} />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {message && <p className="form-message">{message}</p>}

        <div className="employee-card-grid">
          {filteredUsers.length === 0 ? (
            <p className="empty-text">No users found.</p>
          ) : (
            filteredUsers.map((user) => {
              const isCurrentAdmin = user.uid === currentUser?.uid;

              return (
                <article className="employee-card" key={user.uid}>
                  <div className="employee-card-top">
                    <div className="employee-avatar">
                      <UserRound size={24} />
                    </div>

                    <div>
                      <h3>{user.name || "Unnamed User"}</h3>
                      <p>{user.uid}</p>
                    </div>
                  </div>

                  <div className="employee-info-list">
                    <div>
                      <Mail size={15} />
                      <span>{user.email || "No email"}</span>
                    </div>
                    <div>
                      <Phone size={15} />
                      <span>{user.phone || "No phone"}</span>
                    </div>
                    <div>
                      <ShieldCheck size={15} />
                      <span>{user.role || "employee"}</span>
                    </div>
                  </div>

                  <div className="employee-badges">
                    <span className={`user-status-badge ${user.status || "pending"}`}>
                      {user.status || "pending"}
                    </span>
                    <span className={`user-role-badge ${user.role || "employee"}`}>
                      {user.role || "employee"}
                    </span>
                  </div>

                  <div className="employee-action-grid">
                    <button
                      className="small-btn success-btn"
                      onClick={() => handleStatusChange(user, "active")}
                      disabled={isCurrentAdmin}
                    >
                      Approve
                    </button>

                    <button
                      className="small-btn danger-btn"
                      onClick={() => handleStatusChange(user, "blocked")}
                      disabled={isCurrentAdmin}
                    >
                      Block
                    </button>

                    <button
                      className="small-btn"
                      onClick={() => handleRoleChange(user, "employee")}
                      disabled={isCurrentAdmin}
                    >
                      Make Employee
                    </button>

                    <button
                      className="small-btn"
                      onClick={() => handleRoleChange(user, "admin")}
                      disabled={isCurrentAdmin}
                    >
                      Make Admin
                    </button>
                  </div>

                  <button
                    className="employee-edit-btn"
                    onClick={() => openEdit(user)}
                  >
                    Edit Details
                  </button>

                  {isCurrentAdmin && (
                    <p className="current-user-note">
                      This is your current admin account.
                    </p>
                  )}
                </article>
              );
            })
          )}
        </div>
      </section>

      {selectedUser && (
        <div className="employee-modal-backdrop">
          <div className="employee-modal">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Edit</p>
                <h2>Employee Details</h2>
              </div>
              <button
                className="icon-button"
                onClick={() => setSelectedUser(null)}
              >
                ✕
              </button>
            </div>

            <div className="form-group">
              <label>Name</label>
              <input
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                placeholder="Employee name"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                value={editForm.email}
                onChange={handleEditChange}
                placeholder="Email"
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                name="phone"
                value={editForm.phone}
                onChange={handleEditChange}
                placeholder="Phone"
              />
            </div>

            <div className="form-group">
              <label>DOB</label>
              <input
                type="date"
                name="dob"
                value={editForm.dob}
                onChange={handleEditChange}
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={editForm.address}
                onChange={handleEditChange}
                placeholder="Address"
              ></textarea>
            </div>

            <button
              className="primary-btn employee-save-btn"
              onClick={handleSaveDetails}
              disabled={loading}
            >
              Save Employee Details
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default EmployeeManagement;