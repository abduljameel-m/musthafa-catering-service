importScripts("https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBpc4Z_zRuuiFTvZ_--Q-XvJZ6yG0TL8Ko",
  authDomain: "musthafa-catering-service.firebaseapp.com",
  projectId: "musthafa-catering-service",
  storageBucket: "musthafa-catering-service.firebasestorage.app",
  messagingSenderId: "343240360530",
  appId: "1:343240360530:web:f9cba1d9bfa614b04dd58b",
  measurementId: "G-T1TM770568",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const title = payload.notification?.title || "Musthafa Catering Service";

  const options = {
    body: payload.notification?.body || "You have a new shop update.",
    icon: "/profile.png",
    badge: "/profile.png",
    data: {
      url: "/notifications",
    },
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  event.waitUntil(
    clients.openWindow("/notifications")
  );
});