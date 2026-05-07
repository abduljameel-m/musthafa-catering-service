import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import {
  listenToForegroundMessages,
  requestNotificationPermission,
} from "../firebase/firebase";
import { db } from "../firebase/firebase";

export const enablePushNotifications = async (userUid) => {
  if (!userUid) {
    throw new Error("User not found.");
  }

  const token = await requestNotificationPermission();

  const userRef = doc(db, "users", userUid);

  await updateDoc(userRef, {
    fcmToken: token,
    pushEnabled: true,
    pushEnabledAt: serverTimestamp(),
  });

  return token;
};

export const listenForLivePushMessages = async (callback) => {
  return listenToForegroundMessages((payload) => {
    callback(payload);
  });
};