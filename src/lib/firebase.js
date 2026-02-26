import { initializeApp, getApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDmA53TKBHZ-iemfN_MO7_pF7AMm323GiY",
  authDomain: "talent-d98df.firebaseapp.com",
  projectId: "talent-d98df",
  storageBucket: "talent-d98df.firebasestorage.app",
  messagingSenderId: "736793154902",
  appId: "1:736793154902:web:77184dcf902da6b52872f7",
  measurementId: "G-HNN9FVVNB8"
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);