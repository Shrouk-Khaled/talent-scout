import { getMessaging, onMessage, isSupported } from "firebase/messaging";
import { firebaseApp } from "./firebase";

export async function listenForForegroundMessages(callback) {
  console.log("Setting up FCM foreground message listener...");
  if (typeof window === "undefined") return null;

  const supported = await isSupported();
  if (!supported) return null;

  const messaging = getMessaging(firebaseApp);

  const unsubscribe = onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);

    if (callback) {
      callback(payload);
    }
  });

  return unsubscribe;
}