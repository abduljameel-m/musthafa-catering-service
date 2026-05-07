import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPopup,
  signInWithPhoneNumber,
  signOut,
} from "firebase/auth";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBpc4Z_zRuuiFTvZ_--Q-XvJZ6yG0TL8Ko",
  authDomain: "musthafa-catering-service.firebaseapp.com",
  projectId: "musthafa-catering-service",
  storageBucket: "musthafa-catering-service.firebasestorage.app",
  messagingSenderId: "343240360530",
  appId: "1:343240360530:web:f9cba1d9bfa614b04dd58b",
  measurementId: "G-T1TM770568",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

export const vapidKey =
  "BH7kaGmgbqPn6y0LQtFZiaDA13KX0zpgNF_wS3xKrdITNrnhOV3kIEeWpRDCditvVYvNNB-E1lxSi2DOxYXZYjI";

/* ================================
   GOOGLE LOGIN
================================ */

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

/* ================================
   PHONE OTP LOGIN
   Note: Firebase Phone OTP may require billing/Blaze plan.
================================ */

export const setupRecaptcha = (containerId = "recaptcha-container") => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
    });
  }

  return window.recaptchaVerifier;
};

export const sendOtpToPhone = async (phoneNumber) => {
  const appVerifier = setupRecaptcha();

  const confirmationResult = await signInWithPhoneNumber(
    auth,
    phoneNumber,
    appVerifier
  );

  window.confirmationResult = confirmationResult;
  return confirmationResult;
};

export const verifyOtpCode = async (otpCode) => {
  if (!window.confirmationResult) {
    throw new Error("OTP not requested. Please send OTP again.");
  }

  const result = await window.confirmationResult.confirm(otpCode);
  return result.user;
};

/* ================================
   LOGOUT
================================ */

export const logoutFirebase = async () => {
  await signOut(auth);
};

/* ================================
   USER PROFILE
================================ */

export const getUserProfile = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  return {
    id: userSnap.id,
    ...userSnap.data(),
  };
};

export const createUserProfileIfMissing = async (user) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return {
      id: userSnap.id,
      ...userSnap.data(),
    };
  }

  const newProfile = {
    uid: user.uid,
    name: user.displayName || "",
    email: user.email || "",
    phone: user.phoneNumber || "",
    role: "employee",
    status: "pending",
    pushEnabled: false,
    fcmToken: "",
    createdAt: serverTimestamp(),
  };

  await setDoc(userRef, newProfile);

  return {
    id: user.uid,
    ...newProfile,
  };
};

/* ================================
   FIREBASE CLOUD MESSAGING
   Browser / Lock-screen Notification Permission
================================ */

export const getFirebaseMessaging = async () => {
  const supported = await isSupported();

  if (!supported) {
    throw new Error("Firebase messaging is not supported in this browser.");
  }

  return getMessaging(app);
};

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    throw new Error("This browser does not support notifications.");
  }

  if (!("serviceWorker" in navigator)) {
    throw new Error("This browser does not support service workers.");
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  const messaging = await getFirebaseMessaging();

  const serviceWorkerRegistration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js"
  );

  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration,
  });

  if (!token) {
    throw new Error("Unable to get notification token.");
  }

  return token;
};

export const listenToForegroundMessages = async (callback) => {
  const messaging = await getFirebaseMessaging();

  return onMessage(messaging, callback);
};