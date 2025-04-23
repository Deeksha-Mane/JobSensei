// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { firestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Your actual Firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyBX15nrkN6mqZW09HOtneFVj6O0krWuw4I",
  authDomain: "jobsensei-84540.firebaseapp.com",
  projectId: "jobsensei-84540",
  storageBucket: "jobsensei-84540.appspot.com",
  messagingSenderId: "293854344933",
  appId: "1:293854344933:web:227ce709e4dfdf7bc2460c",
  measurementId: "G-VHGEZ3Y68H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = firestore(app);

// Get the form
const loginForm = document.getElementById("loginForm");

// Check if user is already logged in
auth.onAuthStateChanged((user) => {
  if (user) {
    // Check if user is a mentor or mentee
    db.collection("mentors")
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          window.location.href = "../pages/mentor-dashboard.html";
        } else {
          window.location.href = "../pages/mentee-dashboard.html";
        }
      })
      .catch((error) => {
        console.error("Error checking user type:", error);
      });
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  // Show loading state
  const submitBtn = document.querySelector(".login-btn");
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // Check if user is a mentor or mentee
    const user = await auth.currentUser;
    const doc = await db.collection("mentors").doc(user.uid).get();
    if (doc.exists) {
      window.location.href = "../pages/mentor-dashboard.html";
    } else {
      window.location.href = "../pages/mentee-dashboard.html";
    }
  } catch (error) {
    console.error("Login error:", error);
    errorMessage.textContent = error.message;
    errorMessage.style.display = "block";

    // Reset button state
    submitBtn.disabled = false;
    submitBtn.innerHTML = "Login";
  }
});
