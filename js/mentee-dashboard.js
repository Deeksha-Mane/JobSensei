// Mentee Dashboard JavaScript
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
      loadMenteeData(user.uid);
      checkMentorStatus();
      loadGoals(user.uid);
      loadAvailableMentors();
    } else {
      // User is signed out
      window.location.href = "../pages/login.html";
    }
  });

  // Load mentee data
  function loadMenteeData(menteeId) {
    db.collection("mentees")
      .doc(menteeId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          // Update profile information
          document.querySelector(".profile-img").src =
            data.profileImage || "../images/default-profile.png";
          document.querySelector(".mentee-name").textContent = data.name;
          document.querySelector(".mentee-title").textContent = data.title;
          document.querySelector(".mentee-bio").textContent = data.bio;
        }
      })
      .catch((error) => {
        console.error("Error loading mentee data:", error);
      });
  }

  // Load mentor data
  function loadMentorData(menteeId) {
    db.collection("mentees")
      .doc(menteeId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const menteeData = doc.data();
          if (menteeData.mentorId) {
            return db.collection("mentors").doc(menteeData.mentorId).get();
          }
        }
        return null;
      })
      .then((mentorDoc) => {
        if (mentorDoc && mentorDoc.exists) {
          const mentorData = mentorDoc.data();
          // Update mentor information
          document.querySelector(".mentor-info img").src =
            mentorData.profileImage || "../images/default-profile.png";
          document.querySelector(".mentor-details h3").textContent =
            mentorData.name;
          document.querySelector(".mentor-details p").textContent =
            mentorData.title;
        }
      })
      .catch((error) => {
        console.error("Error loading mentor data:", error);
      });
  }

  // Load goals
  function loadGoals(menteeId) {
    db.collection("goals")
      .where("menteeId", "==", menteeId)
      .get()
      .then((querySnapshot) => {
        const goalsList = document.querySelector(".goals-list");
        goalsList.innerHTML = "";

        querySnapshot.forEach((doc) => {
          const goal = doc.data();
          const goalCard = createGoalCard(goal);
          goalsList.appendChild(goalCard);
        });
      })
      .catch((error) => {
        console.error("Error loading goals:", error);
      });
  }

  // Create goal card
  function createGoalCard(goal) {
    const card = document.createElement("div");
    card.className = "goal-card";

    const progress = (goal.completedTasks / goal.totalTasks) * 100;
    const status = progress === 100 ? "Completed" : "In Progress";
    const statusClass =
      progress === 100 ? "status-completed" : "status-in-progress";

    card.innerHTML = `
            <div class="goal-header">
                <h3 class="goal-title">${goal.title}</h3>
                <span class="goal-status ${statusClass}">${status}</span>
            </div>
            <div class="goal-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
            <div class="goal-details">
                <span>Due: ${new Date(goal.dueDate).toLocaleDateString()}</span>
                <span>${progress}% Complete</span>
            </div>
        `;
    return card;
  }

  // Handle message button click
  document.querySelector(".message-btn").addEventListener("click", function () {
    // Implement messaging functionality
    console.log("Message button clicked");
  });

  // Handle schedule button click
  document
    .querySelector(".schedule-btn")
    .addEventListener("click", function () {
      // Implement scheduling functionality
      console.log("Schedule button clicked");
    });

  // Logout functionality
  document.querySelector(".logout-btn").addEventListener("click", function () {
    auth
      .signOut()
      .then(() => {
        window.location.href = "../pages/login.html";
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  });

  // Add these functions after the existing code
  function requestMentor(mentorId) {
    const menteeId = auth.currentUser.uid;

    // Create a request document
    db.collection("mentorRequests")
      .add({
        menteeId: menteeId,
        mentorId: mentorId,
        status: "pending",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        // Update mentee's status
        db.collection("mentees").doc(menteeId).update({
          mentorStatus: "pending",
          requestedMentorId: mentorId,
        });

        // Show success message
        showNotification("Mentor request sent successfully!", "success");
      })
      .catch((error) => {
        console.error("Error sending mentor request:", error);
        showNotification("Failed to send mentor request", "error");
      });
  }

  function checkMentorStatus() {
    const menteeId = auth.currentUser.uid;

    db.collection("mentees")
      .doc(menteeId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          updateMentorStatusUI(data.mentorStatus);

          if (data.mentorStatus === "accepted" && data.mentorId) {
            loadMentorData(menteeId);
          }
        }
      })
      .catch((error) => {
        console.error("Error checking mentor status:", error);
      });
  }

  function updateMentorStatusUI(status) {
    const mentorCard = document.querySelector(".mentor-card");
    const mentorStatus = document.querySelector(".mentor-status");

    if (!mentorStatus) {
      const statusElement = document.createElement("div");
      statusElement.className = "mentor-status";
      mentorCard.insertBefore(statusElement, mentorCard.firstChild);
    }

    const statusElement = document.querySelector(".mentor-status");

    switch (status) {
      case "pending":
        statusElement.innerHTML = `
                <div class="status-pending">
                    <i class="fas fa-clock"></i>
                    <span>Waiting for mentor's response...</span>
                </div>
            `;
        break;
      case "accepted":
        statusElement.innerHTML = `
                <div class="status-accepted">
                    <i class="fas fa-check-circle"></i>
                    <span>Mentor assigned!</span>
                </div>
            `;
        break;
      case "rejected":
        statusElement.innerHTML = `
                <div class="status-rejected">
                    <i class="fas fa-times-circle"></i>
                    <span>Request rejected</span>
                </div>
            `;
        break;
      default:
        statusElement.innerHTML = `
                <div class="status-none">
                    <i class="fas fa-user-plus"></i>
                    <span>No mentor assigned</span>
                </div>
            `;
    }
  }

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

  // Add these functions after the existing code
  function loadAvailableMentors() {
    db.collection("mentors")
      .get()
      .then((querySnapshot) => {
        const mentorsGrid = document.querySelector(".mentors-grid");
        mentorsGrid.innerHTML = "";

        querySnapshot.forEach((doc) => {
          const mentorData = doc.data();
          const mentorCard = createMentorCard(mentorData, doc.id);
          mentorsGrid.appendChild(mentorCard);
        });
      })
      .catch((error) => {
        console.error("Error loading mentors:", error);
      });
  }

  function createMentorCard(mentorData, mentorId) {
    const card = document.createElement("div");
    card.className = "mentor-card";
    card.innerHTML = `
      <div class="mentor-info">
        <img src="${
          mentorData.profileImage || "../images/default-profile.png"
        }" alt="Mentor Profile" />
      </div>
      <div class="mentor-details">
        <h3>${mentorData.name}</h3>
        <p>${mentorData.title}</p>
        <p>${mentorData.experience}</p>
        <p>${mentorData.bio}</p>
      </div>
      <div class="mentor-actions">
        <button class="request-btn" data-mentor-id="${mentorId}">
          <i class="fas fa-user-plus"></i> Request Mentor
        </button>
      </div>
    `;

    // Add click handler for request button
    const requestBtn = card.querySelector(".request-btn");
    requestBtn.addEventListener("click", function () {
      const mentorId = this.getAttribute("data-mentor-id");
      requestMentor(mentorId);
    });

    return card;
  }

  function checkPendingRequest(mentorId) {
    const menteeId = auth.currentUser.uid;
    return db
      .collection("mentorRequests")
      .where("menteeId", "==", menteeId)
      .where("mentorId", "==", mentorId)
      .where("status", "==", "pending")
      .get()
      .then((querySnapshot) => {
        return !querySnapshot.empty;
      })
      .catch((error) => {
        console.error("Error checking pending request:", error);
        return false;
      });
  }
});
