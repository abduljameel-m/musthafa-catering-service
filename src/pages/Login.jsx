import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  ChefHat,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  createUserProfileIfMissing,
  getUserProfile,
  loginWithGoogle,
} from "../firebase/firebase";

function Login() {
  const navigate = useNavigate();
  const { t } = useApp();

  const [activeRole, setActiveRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleSelect = (role) => {
    setActiveRole(role);
    setError("");
  };

  const handleAuthenticatedUser = async (firebaseUser) => {
    const existingProfile = await getUserProfile(firebaseUser.uid);
    const userProfile =
      existingProfile || (await createUserProfileIfMissing(firebaseUser));

    if (userProfile.status !== "active") {
      setError(
        "Your account is waiting for admin approval. Please contact admin."
      );
      return;
    }

    if (userProfile.role !== activeRole) {
      setError(`This account is not registered as ${activeRole}.`);
      return;
    }

    const currentUser = {
      uid: firebaseUser.uid,
      name:
        userProfile.name ||
        firebaseUser.displayName ||
        firebaseUser.phoneNumber ||
        "User",
      email: userProfile.email || firebaseUser.email || "",
      phone: userProfile.phone || firebaseUser.phoneNumber || "",
      role: userProfile.role,
      status: userProfile.status,
    };

    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    if (userProfile.role === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/employee", { replace: true });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const firebaseUser = await loginWithGoogle();
      await handleAuthenticatedUser(firebaseUser);
    } catch (error) {
      console.error(error);
      setError(error.message || "Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-hero">
        <div className="chef-logo-main">
          <ChefHat size={42} />
        </div>

        <p className="brand-tag">{t("smartShopManagement")}</p>
        <h1>{t("companyName")}</h1>
        <p className="brand-subtitle">Secure login with Google.</p>
      </section>

      {!activeRole && (
        <section className="login-card-wrapper">
          <div
            className="login-choice-card"
            onClick={() => handleRoleSelect("admin")}
          >
            <div className="login-icon admin-icon">
              <ShieldCheck size={30} />
            </div>
            <h2>{t("adminLogin")}</h2>
            <p>Manage employees, stocks, attendance, and leave requests.</p>
          </div>

          <div
            className="login-choice-card"
            onClick={() => handleRoleSelect("employee")}
          >
            <div className="login-icon employee-icon">
              <UserRound size={30} />
            </div>
            <h2>{t("employeeLogin")}</h2>
            <p>View your own attendance, profile, and leave details.</p>
          </div>
        </section>
      )}

      {activeRole && (
        <section className="login-form-card firebase-login-card">
          <button
            type="button"
            className="back-role-button"
            onClick={() => {
              setActiveRole(null);
              setError("");
            }}
          >
            <ArrowLeft size={17} />
            {t("back")}
          </button>

          <h2>
            {activeRole === "admin" ? t("adminAccess") : t("employeeAccess")}
          </h2>

          <p className="auth-note">
            Login as <strong>{activeRole}</strong>. Your access will be checked
            from Firebase.
          </p>

          <div className="auth-method-tabs single-auth-tab">
            <button type="button" className="active">
              <Mail size={17} />
              Google
            </button>
          </div>

          <button
            type="button"
            className="login-button firebase-auth-button"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <BadgeCheck size={18} />
            {loading ? "Checking..." : "Continue with Google"}
          </button>

          <p className="auth-note small-auth-note">
            Mobile OTP will be enabled later after Firebase billing is active.
          </p>

          {error && <p className="login-error">{error}</p>}
        </section>
      )}

      <footer className="login-footer">{t("footerRights")}</footer>
    </main>
  );
}

export default Login;