import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export const createNotification = async (notificationData) => {
  const notificationsRef = collection(db, "notifications");

  await addDoc(notificationsRef, {
    title: notificationData.title,
    message: notificationData.message,
    type: notificationData.type || "info",
    audience: notificationData.audience || "all",
    targetUid: notificationData.targetUid || "",
    createdBy: notificationData.createdBy || "",
    createdAt: serverTimestamp(),
  });
};

export const getNotificationsForUser = async (userUid, role) => {
  const notificationsRef = collection(db, "notifications");

  const q = query(notificationsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  const allNotifications = snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));

  return allNotifications.filter((notification) => {
    if (notification.audience === "all") return true;
    if (notification.audience === role) return true;
    if (notification.targetUid === userUid) return true;
    return false;
  });
};

export const getReadNotifications = async (userUid) => {
  const readsRef = collection(db, "notificationReads");
  const q = query(readsRef, where("userUid", "==", userUid));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => docItem.data().notificationId);
};

export const getUnreadNotificationCount = async (userUid, role) => {
  const notifications = await getNotificationsForUser(userUid, role);
  const readIds = await getReadNotifications(userUid);

  return notifications.filter(
    (notification) => !readIds.includes(notification.id)
  ).length;
};

export const markNotificationAsRead = async (notificationId, userUid) => {
  const readId = `${notificationId}_${userUid}`;

  await setDoc(doc(db, "notificationReads", readId), {
    notificationId,
    userUid,
    readAt: serverTimestamp(),
  });
};