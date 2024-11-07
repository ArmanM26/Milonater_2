// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // Analytics можно включить при необходимости

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwC6oitoNOLGvSvHRmipYj7X1948-3GAU",
  authDomain: "millionaire-5fdb1.firebaseapp.com",
  projectId: "millionaire-5fdb1",
  storageBucket: "millionaire-5fdb1.appspot.com", // Исправьте на стандартное значение storage
  messagingSenderId: "958948792763",
  appId: "1:958948792763:web:48468f25d5277dc488cc9e",
  measurementId: "G-VV1BFQY3NT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Подключите, если требуется

// Export Firebase services
export const auth = getAuth(app); // Экспортируйте для регистрации и авторизации
export const db = getFirestore(app); // Экспортируйте для работы с Firestore

export default app;
