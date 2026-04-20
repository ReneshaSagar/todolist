import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQ6gyE55QMlsls0G4yX4-t9X1lPAHn2dA",
  authDomain: "flowstate-83635.firebaseapp.com",
  projectId: "flowstate-83635",
  storageBucket: "flowstate-83635.firebasestorage.app",
  messagingSenderId: "413761178358",
  appId: "1:413761178358:web:c9f3970fe7952168127ad7",
  measurementId: "G-866Z8SMZD6"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
