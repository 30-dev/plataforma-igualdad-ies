// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDOiLS9Q7E813h38rY93-SY3VNRjmgvOM8",
  authDomain: "igualdad-ies.firebaseapp.com",
  databaseURL: "https://igualdad-ies-default-rtdb.firebaseio.com",
  projectId: "igualdad-ies",
  storageBucket: "igualdad-ies.firebasestorage.app",
  messagingSenderId: "920704360198",
  appId: "1:920704360198:web:4d0035181e786abb740887",
  measurementId: "G-V0ZQ1LCV5T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
