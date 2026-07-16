import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDPdX0WVUksjDhUCsOlSHXzTm2XpklJmvA",
  authDomain: "ai-chat-app-4b5ee.firebaseapp.com",
  projectId: "ai-chat-app-4b5ee",
  storageBucket: "ai-chat-app-4b5ee.firebasestorage.app",
  messagingSenderId: "643182260661",
  appId: "1:643182260661:web:6e7f3f9e7eebc716ea69fc",
  measurementId: "G-MB4EVP73T0",
};

const app =
  initializeApp(
    firebaseConfig
  );

export const auth =
  getAuth(app);

export const googleProvider =
  new GoogleAuthProvider();