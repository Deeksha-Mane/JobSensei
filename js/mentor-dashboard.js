// Mentor Dashboard JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyBX15nrkN6mqZW09HOtneFVj6O0krWuw4I",
    authDomain: "jobsensei-84540.firebaseapp.com",
    projectId: "jobsensei-84540",
    storageBucket: "jobsensei-84540.appspot.com", // corrected .app to .com
    messagingSenderId: "293854344933",
    appId: "1:293854344933:web:227ce709e4dfdf7bc2460c",
    measurementId: "G-VHGEZ3Y68H",
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const auth = firebase.auth();

  // Check authentication state
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      loadMentorData(user.uid);
      loadMentees(user.uid);
      loadConnectionRequests(user.uid);
    } else {
      // User is signed out
      window.location.href = "../pages/login.html";
    }
  });

  // Load mentor data
  function loadMentorData(mentorId) {
    db.collection("mentors")
      .doc(mentorId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          // Update profile information
          document.querySelector(".profile-img").src =
            data.profileImage || "/images/default-profile.png";
          document.querySelector(".mentor-name").textContent = data.name;
          document.querySelector(".mentor-title").textContent = data.title;
          document.querySelector(".mentor-bio").textContent = data.bio;

          // Update stats
          document.querySelector(".active-mentees").textContent =
            data.activeMentees || 0;
          document.querySelector(".upcoming-sessions").textContent =
            data.upcomingSessions || 0;
          document.querySelector(".average-rating").textContent =
            data.averageRating || "0.0";
          document.querySelector(".total-hours").textContent =
            data.totalHours || 0;
        }
      })
      .catch((error) => {
        console.error("Error loading mentor data:", error);
      });
  }

  // Load mentees
  function loadMentees(mentorId) {
    db.collection("mentees")
      .where("mentorId", "==", mentorId)
      .get()
      .then((querySnapshot) => {
        const menteesList = document.querySelector(".mentees-list");
        menteesList.innerHTML = "";

        querySnapshot.forEach((doc) => {
          const mentee = doc.data();
          const menteeCard = createMenteeCard(mentee);
          menteesList.appendChild(menteeCard);
        });
      })
      .catch((error) => {
        console.error("Error loading mentees:", error);
      });
  }

  // Create mentee card
  function createMenteeCard(mentee) {
    const card = document.createElement("div");
    card.className = "mentee-card";
    card.innerHTML = `
            <img src="${
              mentee.profileImage || "/images/default-profile.png"
            }" alt="${mentee.name}">
            <div class="mentee-info">
                <h4>${mentee.name}</h4>
                <p>${mentee.title || "Mentee"}</p>
                <p>${mentee.domain || "General"}</p>
            </div>
        `;
    return card;
  }

  // Load connection requests
  function loadConnectionRequests(mentorId) {
    db.collection("connectionRequests")
      .where("mentorId", "==", mentorId)
      .where("status", "==", "pending")
      .get()
      .then((querySnapshot) => {
        const requestsList = document.querySelector(".requests-list");
        requestsList.innerHTML = "";

        querySnapshot.forEach((doc) => {
          const request = doc.data();
          const requestCard = createRequestCard(doc.id, request);
          requestsList.appendChild(requestCard);
        });
      })
      .catch((error) => {
        console.error("Error loading connection requests:", error);
      });
  }

  // Create request card
  function createRequestCard(requestId, request) {
    const card = document.createElement("div");
    card.className = "request-card";
    card.innerHTML = `
            <div class="request-info">
                <img src="${
                  request.menteeImage || "/images/default-profile.png"
                }" alt="${request.menteeName}">
                <div>
                    <h4>${request.menteeName}</h4>
                    <p>${request.message}</p>
                </div>
            </div>
            <div class="request-actions">
                <button class="accept-btn" onclick="handleRequest('${requestId}', 'accepted')">Accept</button>
                <button class="reject-btn" onclick="handleRequest('${requestId}', 'rejected')">Reject</button>
            </div>
        `;
    return card;
  }

  // Handle connection request
  window.handleRequest = function (requestId, action) {
    db.collection("connectionRequests")
      .doc(requestId)
      .update({
        status: action,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        // Reload requests
        loadConnectionRequests(auth.currentUser.uid);
      })
      .catch((error) => {
        console.error("Error handling request:", error);
      });
  };

  // Logout functionality
  document.querySelector(".logout-btn").addEventListener("click", function () {
    auth
      .signOut()
      .then(() => {
        window.location.href = "/login.html";
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  });
});
