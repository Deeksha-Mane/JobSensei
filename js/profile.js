// Firebase imports
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBX15nrkN6mqZW09HOtneFVj6O0krWuw4I",
  authDomain: "jobsensei-84540.firebaseapp.com",
  projectId: "jobsensei-84540",
  storageBucket: "jobsensei-84540.appspot.com",
  messagingSenderId: "293854344933",
  appId: "1:293854344933:web:227ce709e4dfdf7bc2460c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM elements
const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const cityInput = document.getElementById("city");
const skillsInput = document.getElementById("skills");
const educationInput = document.getElementById("education");
const careerInput = document.getElementById("careerInterest");
const emailInput = document.getElementById("email");
const profileForm = document.getElementById("profileForm");
const logoutBtn = document.getElementById("logoutBtn");

// Check if user is logged in
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        nameInput.value = data.name || "";
        ageInput.value = data.age || "";
        cityInput.value = data.city || "";
        skillsInput.value = (data.skills || []).join(", ");
        educationInput.value = data.education || "";
        careerInput.value = data.careerInterest || "";
        emailInput.value = data.email || user.email;

        // Fetch updated user data
        updateProfileProgress(data);

        // ✅ Update progress bar
        const progress = calculateProfileCompletion(data);
        document.getElementById("progress-fill").style.width = progress + "%";
        document.getElementById("progress-text").textContent = progress + "%";
      } else {
        console.log("No user document found.");
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  } else {
    window.location.href = "login.html";
  }
});

// Form submission
profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const age = parseInt(ageInput.value.trim(), 10);
  const city = cityInput.value.trim();
  const skills = skillsInput.value
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
  const education = educationInput.value.trim();
  const careerInterest = careerInput.value.trim();
  const user = auth.currentUser;

  if (
    !name ||
    isNaN(age) ||
    !city ||
    skills.length === 0 ||
    !education ||
    !careerInterest
  ) {
    alert("Please fill in all fields correctly.");
    return;
  }

  if (user) {
    try {
      // Save everything to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name,
        age,
        city,
        skills,
        education,
        careerInterest,
        updatedAt: new Date(),
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Something went wrong while updating profile.");
    }
  }
});

// Logout function
logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      alert("Logged out successfully.");
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Logout error:", error);
    });
});

// Profile completion calculation
function calculateProfileCompletion(userData) {
  let progress = 0;

  if (userData.name) progress += 25;
  if (userData.email) progress += 10;
  if (userData.city) progress += 25;
  if (userData.skills && userData.skills.length > 0) progress += 40;

  return progress;
}

// Update profile progress bar
function updateProfileProgress(userData) {
  const progress = calculateProfileCompletion(userData);
  document.getElementById("progress-fill").style.width = progress + "%";
  document.getElementById("progress-text").textContent = progress + "%";
}