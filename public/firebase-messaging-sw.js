/* eslint-disable no-undef */

importScripts("https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBpc4Z_zRuuiFTvZ_--Q-XvJZ6yG0TL8Ko",
  authDomain: "musthafa-catering-service.firebaseapp.com",
  projectId: "musthafa-catering-service",
  storageBucket: "musthafa-catering-service.firebasestorage.app",
  messagingSenderId: "343240360530",
  appId: "1:343240360530:web:f9cba1d9bfa614b04dd58b",
  measurementId: "G-T1TM770568"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  var title = "Musthafa Catering Service";
  var body = "You have a new shop update.";

  if (payload && payload.notification && payload.notification.title) {
    title = payload.notification.title;
  }

  if (payload && payload.notification && payload.notification.body) {
    body = payload.notification.body;
  }

  self.registration.showNotification(title, {
    body: body,
    icon: "/profile.png",
    badge: "/profile.png",
    data: {
      url: "/notifications"
    }
  });
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  event.waitUntil(
    clients.openWindow("/notifications")
  );
});