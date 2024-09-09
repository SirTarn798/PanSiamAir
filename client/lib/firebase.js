import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACC2AOoQTvbf-tqfFh_q0orlgNO4sHrAQ",
  authDomain: "centralair-a7c32.firebaseapp.com",
  projectId: "centralair-a7c32",
  storageBucket: "centralair-a7c32.appspot.com",
  messagingSenderId: "716270986332",
  appId: "1:716270986332:web:60fa6398db201858c47299"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage();
