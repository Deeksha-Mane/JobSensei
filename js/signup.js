import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBX15nrkN6mqZW09HOtneFVj6O0krWuw4I",
  authDomain: "jobsensei-84540.firebaseapp.com",
  projectId: "jobsensei-84540",
  storageBucket: "jobsensei-84540.appspot.com",
  messagingSenderId: "293854344933",
  appId: "1:293854344933:web:227ce709e4dfdf7bc2460c",
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Signup Logic
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const location = document.getElementById("location").value.trim();
  const skills = document
    .getElementById("skills")
    .value.split(",")
    .map((s) => s.trim());

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Save user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      location: location, // 🆕 Added field
      skills: skills,
      createdAt: new Date(),
    });

    alert("Account created successfully!");
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
    console.error("Signup error:", error);
  }
});
