// Theme Toggle Functionality
document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("theme-toggle");
  const html = document.documentElement;

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    html.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);
  }

  // Theme toggle click handler
  themeToggle.addEventListener("click", function () {
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
  });

  // Update theme icon based on current theme
  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector("i");
    if (theme === "dark") {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    } else {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
    }
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
  apiKey: "",
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

// YouTube API Key - DISABLED FOR SECURITY
// TODO: Add your YouTube API key here or enable it in Google Cloud Console
const apiKey = "YOUR_YOUTUBE_API_KEY_HERE";

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

// Add this to your existing dashboard.js file, right after your existing functions

// Function to add save buttons to recommendation items
function addSaveButtonsToRecommendations() {
  // Get all recommendation items
  const recommendationItems = document.querySelectorAll('.recommendation-item');
  
  recommendationItems.forEach(item => {
    // Check if this item already has a save button
    if (item.querySelector('.save-course-btn')) {
      return; // Skip if button already exists
    }
    
    // Get the link element and extract information
    const linkElement = item.querySelector('a');
    if (!linkElement) return;
    
    const url = linkElement.href;
    const title = linkElement.querySelector('p')?.textContent || 'Unknown Course';
    const thumbnail = linkElement.querySelector('img')?.src || '';
    
    // Extract ID and kind from URL
    let id, kind;
    if (url.includes('playlist')) {
      // It's a playlist
      id = url.split('list=')[1];
      kind = 'youtube#playlist';
    } else if (url.includes('watch')) {
      // It's a video
      id = url.split('v=')[1];
      kind = 'youtube#video';
    } else {
      // Unknown format
      return;
    }
    
    // Create save button
    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-course-btn';
    saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Save';
    saveBtn.dataset.id = id;
    saveBtn.dataset.kind = kind;
    saveBtn.dataset.title = title;
    saveBtn.dataset.thumbnail = thumbnail;
    saveBtn.dataset.url = url;
    
    // Add event listener
    saveBtn.addEventListener('click', saveCourse);
    
    // Add the button to the item
    item.appendChild(saveBtn);
  });
  
  // Check if any courses are already saved
  updateSaveButtonsState();
}

// Function to save a course
async function saveCourse(event) {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to save courses");
    return;
  }

  const button = event.currentTarget;
  const courseData = {
    id: button.dataset.id,
    kind: button.dataset.kind,
    title: button.dataset.title,
    thumbnail: button.dataset.thumbnail,
    url: button.dataset.url,
    savedAt: new Date().toISOString()
  };

  try {
    // Get the user's saved courses collection
    const userCoursesRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userCoursesRef);
    
    if (userDoc.exists()) {
      // Check if the user already has saved courses
      let userData = userDoc.data();
      let savedCourses = userData.savedCourses || [];
      
      // Check if course is already saved
      const courseIndex = savedCourses.findIndex(course => course.id === courseData.id);
      
      if (courseIndex !== -1) {
        // Course already saved, remove it (toggle functionality)
        savedCourses.splice(courseIndex, 1);
        button.classList.remove('saved');
        button.innerHTML = '<i class="fas fa-bookmark"></i> Save';
        alert("Course removed from saved courses!");
      } else {
        // Course not saved, add it
        savedCourses.push(courseData);
        button.classList.add('saved');
        button.innerHTML = '<i class="fas fa-check"></i> Saved';
        alert("Course saved successfully!");
      }
      
      // Update the user document with the new saved courses array
      await setDoc(userCoursesRef, { savedCourses: savedCourses }, { merge: true });
    } else {
      // User document doesn't exist yet, create it with the saved course
      await setDoc(userCoursesRef, { 
        savedCourses: [courseData]
      });
      button.classList.add('saved');
      button.innerHTML = '<i class="fas fa-check"></i> Saved';
      alert("Course saved successfully!");
    }
  } catch (error) {
    console.error("Error saving course:", error);
    alert("Failed to save course. Please try again.");
  }
}

// Function to update save buttons based on currently saved courses
async function updateSaveButtonsState() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const userCoursesRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userCoursesRef);
    
    if (userDoc.exists() && userDoc.data().savedCourses) {
      const savedCourses = userDoc.data().savedCourses;
      const saveButtons = document.querySelectorAll('.save-course-btn');
      
      saveButtons.forEach(button => {
        const courseId = button.dataset.id;
        if (!courseId) return;
        
        const isSaved = savedCourses.some(course => course.id === courseId);
        
        if (isSaved) {
          button.classList.add('saved');
          button.innerHTML = '<i class="fas fa-check"></i> Saved';
        }
      });
    }
  } catch (error) {
    console.error("Error checking saved courses:", error);
  }
}

// Update the existing render recommendations function
const originalRenderRecommendations = renderRecommendations;
renderRecommendations = function(type, items) {
  originalRenderRecommendations(type, items);
  
  // Add save buttons after rendering
  setTimeout(() => {
    addSaveButtonsToRecommendations();
  }, 300);
};

// Add this at the end of your dashboard.js file
document.getElementById("savejob").addEventListener("click", () => {
  // Create temporary saved courses page if it doesn't exist yet
  showSavedCourses();
});

// Function to show saved courses in a modal/popup if the page doesn't exist yet
function showSavedCourses() {
  // Get current user
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to view saved courses");
    return;
  }
  
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'saved-courses-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Your Saved Courses</h2>
        <button class="close-modal">&times;</button>
      </div>
      <div class="modal-body">
        <p>Loading saved courses...</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add close functionality
  modal.querySelector('.close-modal').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .saved-courses-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .modal-content {
      background-color: var(--bg-primary);
      border-radius: 8px;
      width: 80%;
      max-width: 800px;
      max-height: 80%;
      overflow-y: auto;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
    }
    .modal-body {
      padding: 1rem;
    }
    .close-modal {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--text-primary);
    }
    .saved-course-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      margin-bottom: 1rem;
      background-color: var(--bg-secondary);
      border-radius: 8px;
    }
    .course-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .course-info img {
      width: 100px;
      height: auto;
      border-radius: 4px;
    }
    .course-actions {
      display: flex;
      gap: 0.5rem;
    }
    .view-btn, .remove-btn {
      padding: 0.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .view-btn {
      background-color: #0b5ed7;
      color: white;
    }
    .remove-btn {
      background-color: #dc3545;
      color: white;
    }
  `;
  document.head.appendChild(style);
  
  // Load saved courses
  loadSavedCoursesIntoModal(modal.querySelector('.modal-body'));
}

// Function to load saved courses into modal
async function loadSavedCoursesIntoModal(container) {
  const user = auth.currentUser;
  if (!user) return;
  
  try {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists() && userDoc.data().savedCourses) {
      const savedCourses = userDoc.data().savedCourses;
      
      if (savedCourses.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 2rem;">
            <p>You haven't saved any courses yet.</p>
          </div>
        `;
      } else {
        container.innerHTML = '';
        
        savedCourses.forEach(course => {
          const courseItem = document.createElement('div');
          courseItem.className = 'saved-course-item';
          
          courseItem.innerHTML = `
            <div class="course-info">
              <img src="${course.thumbnail}" alt="${course.title}">
              <div>
                <h4>${course.title}</h4>
                <p>${course.kind.includes('playlist') ? 'Playlist' : 'Video'}</p>
              </div>
            </div>
            <div class="course-actions">
              <a href="${course.url}" target="_blank" class="view-btn">View</a>
              <button class="remove-btn" data-id="${course.id}">Remove</button>
            </div>
          `;
          
          container.appendChild(courseItem);
          
          // Add remove functionality
          courseItem.querySelector('.remove-btn').addEventListener('click', async () => {
            if (confirm('Are you sure you want to remove this course?')) {
              try {
                await updateDoc(userDocRef, {
                  savedCourses: arrayRemove(course)
                });
                
                container.removeChild(courseItem);
                
                if (container.children.length === 0) {
                  container.innerHTML = `
                    <div style="text-align: center; padding: 2rem;">
                      <p>You haven't saved any courses yet.</p>
                    </div>
                  `;
                }
                
                // Update save buttons in recommendations
                updateSaveButtonsState();
              } catch (error) {
                console.error('Error removing course:', error);
                alert('Failed to remove course.');
              }
            }
          });
        });
      }
    } else {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <p>You haven't saved any courses yet.</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading saved courses:', error);
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <p>Error loading saved courses. Please try again.</p>
      </div>
    `;
  }
}

// Make sure to import arrayRemove from Firestore
import { arrayRemove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";