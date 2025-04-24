// Theme Toggle Functionality
const themeToggle = document.getElementById("theme-toggle");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

// Check for saved theme preference or use system preference
const currentTheme = localStorage.getItem("theme");
if (currentTheme === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
} else if (currentTheme === "light") {
  document.documentElement.setAttribute("data-theme", "light");
  themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
} else if (prefersDarkScheme.matches) {
  document.documentElement.setAttribute("data-theme", "dark");
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
} else {
  document.documentElement.setAttribute("data-theme", "light");
  themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}

// Theme toggle button click handler
themeToggle.addEventListener("click", () => {
  if (document.documentElement.getAttribute("data-theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
});

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Firebase config
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
const db = getFirestore(app);

// YouTube API Key
const apiKey = "AIzaSyA-mFYtm2uhyEWJ00ORXy6nvEHaPTd7z_8";

let userSkills = [];

// Auth state check
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const name = userData.name || user.email;
        document.getElementById("greeting").textContent = `Welcome, ${name}!`;

        userSkills = userData.skills || [];
        console.log("User Skills on Load:", userSkills);
        renderSkillChips(userSkills);

        if (userSkills.length > 0) {
          await fetchYouTubeRecommendations(userSkills);
        } else {
          document.getElementById("recommendations-card").innerHTML =
            "<h3>YouTube Recommendations</h3><p>No skills provided for recommendations.</p>";
        }
      } else {
        document.getElementById(
          "greeting"
        ).textContent = `Welcome, ${user.email}!`;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  } else {
    window.location.href = "login.html";
  }
});

// Logout
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

// Fetch YouTube recommendations with playlist priority
async function fetchYouTubeRecommendations(skills) {
  const allRecommendations = {
    Playlists: [],
    Videos: [],
  };

  const container = document.getElementById("recommendations-card");
  container.innerHTML = `<h3>YouTube Recommendations</h3><p>Loading...</p>`;

  try {
    for (const skill of skills) {
      let foundPlaylist = false;

      const playlistRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          skill + " playlist"
        )}&maxResults=2&type=playlist&key=${apiKey}`
      );
      const playlistData = await playlistRes.json();
      console.log("Playlist API Response for", skill, playlistData);

      if (playlistData.items?.length) {
        allRecommendations.Playlists.push(...playlistData.items);
        foundPlaylist = true;
      }

      if (!foundPlaylist) {
        const videoRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            skill + " tutorial"
          )}&maxResults=2&type=video&key=${apiKey}`
        );
        const videoData = await videoRes.json();
        console.log("Video API Response for", skill, videoData);

        if (videoData.items?.length) {
          allRecommendations.Videos.push(...videoData.items);
        }
      }
    }

    container.innerHTML = `<h3>YouTube Recommendations</h3><div id="recommendation-wrapper"></div>`;

    if (allRecommendations.Playlists.length > 0) {
      renderRecommendations("Playlists", allRecommendations.Playlists);
    }
    if (allRecommendations.Videos.length > 0) {
      renderRecommendations("Videos", allRecommendations.Videos);
    }
    if (
      allRecommendations.Playlists.length === 0 &&
      allRecommendations.Videos.length === 0
    ) {
      container.innerHTML +=
        "<p>No YouTube results found. Try adding more common skills.</p>";
    }
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    container.innerHTML += "<p>Could not load recommendations.</p>";
  }
}

function renderRecommendations(type, items) {
  const container = document.getElementById("recommendation-wrapper");

  const section = document.createElement("div");
  section.classList.add("recommendation-section");
  section.innerHTML = `<h4>${type}</h4>`;

  const itemWrapper = document.createElement("div");
  itemWrapper.classList.add("item-wrapper");

  let topItemIndex = 0;

  // Optional: Sort by title length (as a basic "weight") or choose first one
  // Later: Replace with actual metrics if fetched
  // Here, we just pick the first as a placeholder for best
  items.forEach((item, index) => {
    const id = item.id.videoId || item.id.playlistId;
    const kind = item.id.kind;
    const url = kind.includes("playlist")
      ? `https://www.youtube.com/playlist?list=${id}`
      : `https://www.youtube.com/watch?v=${id}`;

    const thumbnail =
      item.snippet.thumbnails?.medium?.url ||
      "https://via.placeholder.com/100x70?text=No+Image";

    const el = document.createElement("div");
    el.classList.add("recommendation-item");
    if (index === topItemIndex) el.classList.add("best-pick");
    if (index >= 2) el.classList.add("hidden-item");

    el.innerHTML = `
      <a href="${url}" target="_blank" rel="noopener noreferrer">
        <img src="${thumbnail}" alt="${item.snippet.title}" />
        <p>${item.snippet.title}</p>
      </a>
    `;
    itemWrapper.appendChild(el);
  });

  section.appendChild(itemWrapper);

  if (items.length > 2) {
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "Show More";
    toggleBtn.classList.add("toggle-button");

    toggleBtn.addEventListener("click", () => {
      section.querySelectorAll(".hidden-item").forEach((item) => {
        item.classList.toggle("show");
      });
      toggleBtn.textContent =
        toggleBtn.textContent === "Show More" ? "Show Less" : "Show More";
    });

    section.appendChild(toggleBtn);
  }

  container.appendChild(section);
}

function renderSkillChips(skills) {
  const skillsList = document.getElementById("skills-list");
  skillsList.innerHTML = "";

  skills.forEach((skill) => {
    const chip = document.createElement("div");
    chip.classList.add("skill-chip");
    chip.innerHTML = `
      ${skill}
      <button onclick="removeSkill('${skill}')">×</button>
    `;
    skillsList.appendChild(chip);
  });
}

window.removeSkill = function (skill) {
  userSkills = userSkills.filter((s) => s !== skill);
  renderSkillChips(userSkills);
};

document.getElementById("add-skill-btn").addEventListener("click", () => {
  const newSkillInput = document.getElementById("new-skill");
  const skill = newSkillInput.value.trim();

  if (skill && !userSkills.includes(skill)) {
    userSkills.push(skill);
    renderSkillChips(userSkills);
    newSkillInput.value = "";
  }
});

document
  .getElementById("save-skills-btn")
  .addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { skills: userSkills }, { merge: true });
      alert("Skills updated!");
      await fetchYouTubeRecommendations(userSkills);
    } catch (error) {
      console.error("Error saving skills:", error);
      alert("Failed to save skills.");
    }

    // Add this to ensure animations trigger properly
    document.addEventListener("DOMContentLoaded", () => {
      // Slight delay to ensure cards are properly positioned before animation starts
      setTimeout(() => {
        document.body.classList.add("loaded");
      }, 100);
    });
  });

document.addEventListener("DOMContentLoaded", () => {
  // Get necessary elements
  const chatIcon = document.getElementById("chatIcon");
  const chatWindow = document.getElementById("chatWindow");
  const closeChat = document.getElementById("closeChat");
  const userMessage = document.getElementById("userMessage");
  const sendMessage = document.getElementById("sendMessage");
  const chatMessages = document.getElementById("chatMessages");

  // Function to toggle chat window
  function toggleChat() {
    chatWindow.classList.toggle("active");
  }

  // Simple responses for demo
  const botResponses = {
    hello: "Hi there! How can I help with your job search?",
    hi: "Hello! What can I help you with today?",
    help: "I can help you with your resume, job applications, interview tips, and career advice. What do you need assistance with?",
    job: "Are you looking for job recommendations? I can help you find positions that match your skills.",
    resume:
      "I can provide tips to improve your resume. Would you like some guidance?",
    interview:
      "Preparing for an interview? I have some tips that might help you succeed!",
    default:
      "I'm here to help with your job search journey. Could you provide more details about what you need?",
  };

  // Function to add message to chat
  function addMessage(message, isSent) {
    const messageDiv = document.createElement("div");
    messageDiv.className = isSent ? "message sent" : "message received";

    const messageContent = document.createElement("div");
    messageContent.className = "message-content";
    messageContent.textContent = message;

    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Function to get bot response
  function getBotResponse(message) {
    const lowerMsg = message.toLowerCase();

    // Check for keywords
    for (const [key, response] of Object.entries(botResponses)) {
      if (lowerMsg.includes(key)) {
        return response;
      }
    }

    // If no keyword matches
    return botResponses.default;
  }

  // Function to handle send message
  function handleSendMessage() {
    const message = userMessage.value.trim();
    if (message === "") return;

    // Add user message
    addMessage(message, true);

    // Clear input
    userMessage.value = "";

    // Simulate typing delay for bot response
    setTimeout(() => {
      const botResponse = getBotResponse(message);
      addMessage(botResponse, false);
    }, 600);
  }

  // Event Listeners
  chatIcon.addEventListener("click", toggleChat);
  closeChat.addEventListener("click", toggleChat);

  sendMessage.addEventListener("click", handleSendMessage);

  userMessage.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  });
});
