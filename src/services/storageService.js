import { initialStocks } from "../data/initialData";

export const getFromStorage = (key, defaultValue) => {
  try {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : defaultValue;
  } catch (error) {
    console.error("LocalStorage read error:", error);
    return defaultValue;
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("LocalStorage save error:", error);
  }
};

export const initializeAppData = () => {
  if (!localStorage.getItem("stocks")) {
    saveToStorage("stocks", initialStocks);
  }

  if (!localStorage.getItem("leaveRequests")) {
    saveToStorage("leaveRequests", []);
  }

  if (!localStorage.getItem("attendance")) {
    saveToStorage("attendance", []);
  }
};