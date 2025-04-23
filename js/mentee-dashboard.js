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
      loadMentorData(user.uid);
      loadGoals(user.uid);
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
});
