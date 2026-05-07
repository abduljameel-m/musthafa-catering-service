import { useNavigate } from "react-router-dom";
import { ArrowRight, ChefHat, Globe2, Moon, Sun } from "lucide-react";
import { languageOptions } from "../data/translations";
import { useApp } from "../context/AppContext";

function Landing() {
  const navigate = useNavigate();
  const { language, setLanguage, theme, setTheme, t } = useApp();

  return (
    <main className="landing-page minimal-landing">
      <header className="minimal-landing-topbar">
        <div className="minimal-language-box">
          <Globe2 size={18} />
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

        <button
          className="theme-switch-button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          <span>{theme === "dark" ? t("lightMode") : t("darkMode")}</span>
        </button>
      </header>

      <section className="minimal-landing-content">
        <div className="chef-logo-main">
          <ChefHat size={46} />
        </div>

        <p className="brand-tag">{t("smartShopManagement")}</p>

        <h1>{t("companyName")}</h1>

        <p className="minimal-tagline">{t("tagline")}</p>

        <button className="enter-button minimal-enter" onClick={() => navigate("/login")}>
          {t("enter")}
          <ArrowRight size={17} />
        </button>
      </section>

      <footer className="minimal-footer">{t("footerRights")}</footer>
    </main>
  );
}

export default Landing;