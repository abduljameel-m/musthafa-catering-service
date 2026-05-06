import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, Languages, MapPin, Moon, Save, Sun, UserRound } from "lucide-react";
import Layout from "../components/Layout";
import { languageOptions } from "../data/translations";
import { useApp } from "../context/AppContext";

function Settings() {
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    profile,
    setProfile,
    t,
  } = useApp();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const role = currentUser?.role || "employee";

  const [localProfile, setLocalProfile] = useState({
    name: "",
    dob: "",
    address: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    setLocalProfile({
      name: profile?.name || currentUser?.name || "",
      dob: profile?.dob || "",
      address: profile?.address || "",
    });
  }, [profile?.name, profile?.dob, profile?.address, currentUser?.name]);

  const handleProfileChange = (event) => {
    setLocalProfile({
      ...localProfile,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const updatedProfile = {
      name: localProfile.name.trim(),
      dob: localProfile.dob,
      address: localProfile.address.trim(),
    };

    setProfile(updatedProfile);
    localStorage.setItem("profile", JSON.stringify(updatedProfile));

    const updatedUser = {
      ...currentUser,
      name: updatedProfile.name || currentUser?.name || "User",
    };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    setMessage(t("settingsSaved"));

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  return (
    <Layout role={role}>
      <div className="page-header settings-header">
        <div>
          <p className="eyebrow">{t("settings")}</p>
          <h1>{t("settings")}</h1>
          <p>{t("settingsSubtitle")}</p>
        </div>
      </div>

      <div className="settings-layout">
        <section className="settings-profile-card">
          <div className="settings-avatar">
            <UserRound size={34} />
          </div>

          <h2>{localProfile.name || currentUser?.name || "User"}</h2>
          <p>{role === "admin" ? "Administrator" : "Employee"}</p>

          <div className="settings-mini-list">
            <div>
              <CalendarDays size={17} />
              <span>{localProfile.dob || t("dob")}</span>
            </div>
            <div>
              <MapPin size={17} />
              <span>{localProfile.address || t("address")}</span>
            </div>
          </div>
        </section>

        <form className="form-card settings-card" onSubmit={handleSubmit}>
          <div className="settings-section-title">
            <h2>{t("profileSettings")}</h2>
            <p>{t("profileSettingsHint")}</p>
          </div>

          <div className="form-group input-with-icon">
            <label>{t("profileName")}</label>
            <div className="field-shell">
              <UserRound size={18} />
              <input
                type="text"
                name="name"
                value={localProfile.name}
                onChange={handleProfileChange}
                placeholder={t("profileName")}
              />
            </div>
          </div>

          <div className="form-group input-with-icon">
            <label>{t("dob")}</label>
            <div className="field-shell">
              <CalendarDays size={18} />
              <input
                type="date"
                name="dob"
                value={localProfile.dob}
                onChange={handleProfileChange}
              />
            </div>
          </div>

          <div className="form-group input-with-icon">
            <label>{t("address")}</label>
            <div className="field-shell textarea-shell">
              <MapPin size={18} />
              <textarea
                name="address"
                value={localProfile.address}
                onChange={handleProfileChange}
                placeholder={t("address")}
              ></textarea>
            </div>
          </div>

          <div className="settings-section-title">
            <h2>{t("preferences")}</h2>
            <p>{t("preferencesHint")}</p>
          </div>

          <div className="form-group input-with-icon">
            <label>{t("language")}</label>
            <div className="field-shell">
              <Languages size={18} />
              <select
                className="settings-select"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
              >
                {languageOptions.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>{t("themeMode")}</label>
            <div className="theme-toggle-row">
              <button
                type="button"
                className={`theme-choice ${theme === "light" ? "active" : ""}`}
                onClick={() => setTheme("light")}
              >
                <Sun size={17} />
                {t("lightMode")}
              </button>

              <button
                type="button"
                className={`theme-choice ${theme === "dark" ? "active" : ""}`}
                onClick={() => setTheme("dark")}
              >
                <Moon size={17} />
                {t("darkMode")}
              </button>
            </div>
          </div>

          {message && (
            <p className="form-message success-message">
              <CheckCircle2 size={18} />
              {message}
            </p>
          )}

          <button className="primary-btn settings-save-btn" type="submit">
            <Save size={18} />
            {t("saveSettings")}
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default Settings;