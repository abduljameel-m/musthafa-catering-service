import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export const getAllUsers = async () => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));
};

export const updateUserStatus = async (uid, status) => {
  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, {
    status,
    updatedAt: serverTimestamp(),
  });
};

export const updateUserRole = async (uid, role) => {
  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, {
    role,
    updatedAt: serverTimestamp(),
  });
};

export const updateUserDetails = async (uid, details) => {
  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, {
    name: details.name || "",
    phone: details.phone || "",
    email: details.email || "",
    dob: details.dob || "",
    address: details.address || "",
    updatedAt: serverTimestamp(),
  });
};