import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, setDoc } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js'

const firebaseConfig = {
  apiKey: "AIzaSyAsfgxJJ_sugLJpngDLPw8aAg73_BAZ_Io",
  authDomain: "braincheck-8669a.firebaseapp.com",
  projectId: "braincheck-8669a",
  storageBucket: "braincheck-8669a.firebasestorage.app",
  messagingSenderId: "427324920365",
  appId: "1:427324920365:web:277bd59b2e64b50e44dea4",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)

export { auth, db, createUserWithEmailAndPassword, collection, addDoc, doc, setDoc, updateProfile };
