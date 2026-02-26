import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { firebaseApp } from "./firebase";

export async function getFcmToken() {
  if (typeof window === "undefined") return null;

  const supported = await isSupported();
  if (!supported) return null;

  if (!("serviceWorker" in navigator)) return null;
  if (!("Notification" in window)) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const swReg = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

  const messaging = getMessaging(firebaseApp);

  const token = await getToken(messaging, {
    vapidKey: "BCfDhMM8pVraiYZjphz_mD9V9aUIyryAXryUOoEDCE1R7RZ7SLV2bbuVakXIPHaV9kQuSZYI7Lnjz3G4UvzUsmY", // VAPID
    serviceWorkerRegistration: swReg,
  });

  return token || null;
}
