// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBX15nrkN6mqZW09HOtneFVj6O0krWuw4I",
  authDomain: "jobsensei-84540.firebaseapp.com",
  projectId: "jobsensei-84540",
  storageBucket: "jobsensei-84540.appspot.com", // ✅ fixed URL (.app → .appspot.com)
  messagingSenderId: "293854344933",
  appId: "1:293854344933:web:227ce709e4dfdf7bc2460c",
  measurementId: "G-VHGEZ3Y68H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Check if user is logged in
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const name = userData.name || user.email;
        document.getElementById("greeting").textContent = `Welcome, ${name}!`;
      } else {
        console.warn("User document not found in Firestore.");
        document.getElementById("greeting").textContent = `Welcome, ${user.email}!`;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  } else {
    // Not logged in → redirect to login page
    window.location.href = "login.html";
  }
});

// Logout function
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      alert("Logged out successfully!");
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Logout error:", error);
    });
});
