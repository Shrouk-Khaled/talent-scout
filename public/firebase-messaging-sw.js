/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDmA53TKBHZ-iemfN_MO7_pF7AMm323GiY",
  authDomain: "talent-d98df.firebaseapp.com",
  projectId: "talent-d98df",
  storageBucket: "talent-d98df.firebasestorage.app",
  messagingSenderId: "736793154902",
  appId: "1:736793154902:web:77184dcf902da6b52872f7",
});

firebase.messaging();

// Optional: Handle background messages if needed
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message:", payload);

  const notificationTitle =
    payload?.notification?.title || "New Notification";

  const notificationOptions = {
    body: payload?.notification?.body || "You have a new message",
    icon: "/icon.png",
    data: payload?.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const urlToOpen = "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});