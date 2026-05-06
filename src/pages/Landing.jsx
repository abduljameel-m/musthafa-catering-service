import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { languageOptions } from "../data/translations";
import { useApp } from "../context/AppContext";

function Landing() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useApp();

  return (
    <main className="landing-page">
      <div className="landing-language">
        <select
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

      <section className="landing-card">
        <p className="brand-tag">{t("smartShopManagement")}</p>
        <h1>{t("companyName")}</h1>
        <p>{t("tagline")}</p>

        <button className="enter-button" onClick={() => navigate("/login")}>
          {t("enter")}
          <ArrowRight size={18} />
        </button>
      </section>

      <footer className="login-footer">{t("footerRights")}</footer>
    </main>
  );
}

export default Landing;