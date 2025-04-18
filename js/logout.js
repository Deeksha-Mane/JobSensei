import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const auth = getAuth();
signOut(auth)
  .then(() => {
    // Redirect to login page after successful logout
    window.location.href = "login.html";
  })
  .catch((error) => {
    console.error("Error logging out:", error.message);
    alert(`Error: ${error.message}`);
  });
