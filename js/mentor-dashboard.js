// Mentor Dashboard JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Firebase
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
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.firestore();
  const auth = firebase.auth();

  // Check authentication state
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("User is signed in:", user.uid);
      loadMentorData(user.uid);
      loadMentorRequests(user.uid);
      loadMentees(user.uid);
    } else {
      console.log("No user is signed in, redirecting to login");
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
          document.querySelector(".mentee-count").textContent =
            data.menteeCount || 0;

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

  // Load mentor requests
  function loadMentorRequests(mentorId) {
    db.collection("mentorRequests")
      .where("mentorId", "==", mentorId)
      .where("status", "==", "pending")
      .get()
      .then((querySnapshot) => {
        const requestsList = document.querySelector(".requests-list");
        requestsList.innerHTML = "";

        querySnapshot.forEach((doc) => {
          const request = doc.data();
          loadMenteeDetails(request.menteeId, doc.id);
        });
      })
      .catch((error) => {
        console.error("Error loading mentor requests:", error);
      });
  }

  // Load mentee details for a request
  function loadMenteeDetails(menteeId, requestId) {
    db.collection("mentees")
      .doc(menteeId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const menteeData = doc.data();
          const requestCard = createRequestCard(menteeData, requestId);
          document.querySelector(".requests-list").appendChild(requestCard);
        }
      })
      .catch((error) => {
        console.error("Error loading mentee details:", error);
      });
  }

  // Create request card
  function createRequestCard(menteeData, requestId) {
    const card = document.createElement("div");
    card.className = "request-card";

    card.innerHTML = `
            <div class="request-header">
                <img src="${
                  menteeData.profileImage || "/images/default-profile.png"
                }" alt="Mentee Profile" class="mentee-img">
                <div class="mentee-info">
                    <h3>${menteeData.name}</h3>
                    <p>${menteeData.title}</p>
                </div>
            </div>
            <div class="request-actions">
                <button class="accept-btn" data-request-id="${requestId}">
                    <i class="fas fa-check"></i> Accept
                </button>
                <button class="reject-btn" data-request-id="${requestId}">
                    <i class="fas fa-times"></i> Reject
                </button>
            </div>
        `;

    return card;
  }

  // Handle accept request
  function handleAcceptRequest(requestId) {
    db.collection("mentorRequests")
      .doc(requestId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const request = doc.data();
          const batch = db.batch();

          // Update request status
          batch.update(doc.ref, { status: "accepted" });

          // Update mentee's mentor status
          batch.update(db.collection("mentees").doc(request.menteeId), {
            mentorStatus: "accepted",
            mentorId: auth.currentUser.uid,
          });

          // Update mentor's mentee count
          batch.update(db.collection("mentors").doc(auth.currentUser.uid), {
            menteeCount: firebase.firestore.FieldValue.increment(1),
          });

          return batch.commit();
        }
      })
      .then(() => {
        showNotification("Mentee request accepted successfully!", "success");
        loadMentorRequests(auth.currentUser.uid);
        loadMentorData(auth.currentUser.uid);
      })
      .catch((error) => {
        console.error("Error accepting request:", error);
        showNotification("Failed to accept request", "error");
      });
  }

  // Handle reject request
  function handleRejectRequest(requestId) {
    db.collection("mentorRequests")
      .doc(requestId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const request = doc.data();
          const batch = db.batch();

          // Update request status
          batch.update(doc.ref, { status: "rejected" });

          // Update mentee's mentor status
          batch.update(db.collection("mentees").doc(request.menteeId), {
            mentorStatus: "rejected",
            requestedMentorId: null,
          });

          return batch.commit();
        }
      })
      .then(() => {
        showNotification("Mentee request rejected", "info");
        loadMentorRequests(auth.currentUser.uid);
      })
      .catch((error) => {
        console.error("Error rejecting request:", error);
        showNotification("Failed to reject request", "error");
      });
  }

  // Event listeners for accept/reject buttons
  document.addEventListener("click", function (e) {
    if (e.target.closest(".accept-btn")) {
      const requestId = e.target.closest(".accept-btn").dataset.requestId;
      handleAcceptRequest(requestId);
    } else if (e.target.closest(".reject-btn")) {
      const requestId = e.target.closest(".reject-btn").dataset.requestId;
      handleRejectRequest(requestId);
    }
  });

  // Show notification
  function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
            <i class="fas ${
              type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
            }"></i>
            <span>${message}</span>
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
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
