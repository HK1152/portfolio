import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyChrOvHepuYGq9wXXoBaOeQoWmeckcg6O8",
  authDomain: "hk-portfolio-1152.firebaseapp.com",
  projectId: "hk-portfolio-1152",
  storageBucket: "hk-portfolio-1152.firebasestorage.app",
  messagingSenderId: "765352069737",
  appId: "1:765352069737:web:aad05c309fe6293b7230f8",
  measurementId: "G-9ZXPHSH7HE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
