import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "../data/translations";

const AppContext = createContext(null);

const defaultProfile = {
  name: "",
  dob: "",
  address: "",
};

function safeJsonParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

export function AppProvider({ children }) {
  // Always start website in English
  const [language, setLanguageState] = useState("en");

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const [profile, setProfileState] = useState(() => {
    const savedProfile = localStorage.getItem("profile");
    return safeJsonParse(savedProfile, defaultProfile);
  });

  useEffect(() => {
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("profile", JSON.stringify(profile));
  }, [profile]);

  const t = (key) => {
    return translations?.[language]?.[key] || translations?.en?.[key] || key;
  };

  const setLanguage = (newLanguage) => {
    setLanguageState(newLanguage);
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  const setProfile = (updatedProfile) => {
    const cleanProfile = {
      name: updatedProfile?.name || "",
      dob: updatedProfile?.dob || "",
      address: updatedProfile?.address || "",
    };

    setProfileState(cleanProfile);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      theme,
      setTheme,
      toggleTheme,
      profile,
      setProfile,
      t,
    }),
    [language, theme, profile]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }

  return context;
}