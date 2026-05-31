// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbhdjHhufdKDSMbkDkXBY2gDfDQ1sAu38",
  authDomain: "ai-planner-2ca38.firebaseapp.com",
  projectId: "ai-planner-2ca38",
  storageBucket: "ai-planner-2ca38.firebasestorage.app",
  messagingSenderId: "527923170633",
  appId: "1:527923170633:web:916a3f355ae4d722f61e98",
  measurementId: "G-MJW16LJ5RN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);