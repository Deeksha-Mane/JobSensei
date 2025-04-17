// Import Firebase core and services
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBX15nrkN6mqZW09HOtneFVj6O0krWuw4I",
  authDomain: "jobsensei-84540.firebaseapp.com",
  projectId: "jobsensei-84540",
  storageBucket: "jobsensei-84540.appspot.com", // corrected .app to .com
  messagingSenderId: "293854344933",
  appId: "1:293854344933:web:227ce709e4dfdf7bc2460c",
  measurementId: "G-VHGEZ3Y68H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("Firebase Initialized");

// Initialize Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// =================== AUTH FUNCTIONS ===================

// Sign up function
function signUp(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("User signed up:", userCredential.user);
    })
    .catch((error) => {
      console.error("Error signing up:", error.message);
    });
}

// Log in function
function logIn(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("User logged in:", userCredential.user);
    })
    .catch((error) => {
      console.error("Error logging in:", error.message);
    });
}

// =================== FIRESTORE FUNCTIONS ===================

// Reference to the "users" collection
const jobsenseiRef = collection(db, "users");

// Add a document to Firestore
async function addUser(name, email, skills) {
  try {
    const docRef = await addDoc(jobsenseiRef, {
      name: name,
      email: email,
      skills: skills,
      timestamp: new Date()
    });
    console.log("Document written with ID:", docRef.id);
  } catch (e) {
    console.error("Error adding document:", e);
  }
}

// Read all users from Firestore
async function getAllUsers() {
  const querySnapshot = await getDocs(jobsenseiRef);
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} =>`, doc.data());
  });
}

// =================== FORM HANDLING ===================

document.getElementById("userForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const skills = document.getElementById("skills").value.split(",");

  addUser(name, email, skills);
});
