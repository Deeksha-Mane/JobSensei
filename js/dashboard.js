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
const apiKey = 'AIzaSyCqxm3UD4LHRBNY3NmYZwtgieAx2w8t6Gw';

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
        renderSkillChips(userSkills);

        if (userSkills.length > 0) {
          await fetchYouTubeRecommendations(userSkills);
        } else {
          document.getElementById("recommendations-card").innerHTML =
            "<h3>YouTube Recommendations</h3><p>No skills provided for recommendations.</p>";
        }
      } else {
        document.getElementById("greeting").textContent = `Welcome, ${user.email}!`;
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

// Fetch YouTube recommendations
async function fetchYouTubeRecommendations(skills) {
  const videos = [];
  const playlists = [];
  const channels = [];

  const container = document.getElementById("recommendations-card");
  container.innerHTML = `<h3>YouTube Recommendations</h3><p>Loading...</p>`;

  try {
    for (const skill of skills) {
      const videoRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(skill + ' tutorial')}&maxResults=3&type=video&key=${apiKey}`
      );
      console.log('Skills:', skills);
      const videoData = await videoRes.json();
      if (videoData.items?.length) videos.push(...videoData.items);
      console.log('Video Data:', videoData);
      

      const playlistRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(skill + ' playlist')}&maxResults=3&type=playlist&key=${apiKey}`
      );
      const playlistData = await playlistRes.json();
      if (playlistData.items?.length) playlists.push(...playlistData.items);

      const channelRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(skill + ' channel')}&maxResults=3&type=channel&key=${apiKey}`
      );
      const channelData = await channelRes.json();
      if (channelData.items?.length) channels.push(...channelData.items);
    }

    container.innerHTML = `<h3>YouTube Recommendations</h3><div id="recommendation-wrapper"></div>`;

    console.log('Videos:', videos);
console.log('Playlists:', playlists);
console.log('Channels:', channels);

    if (videos.length > 0) renderRecommendations("Videos", videos);
    if (playlists.length > 0) renderRecommendations("Playlists", playlists);
    if (channels.length > 0) renderRecommendations("Channels", channels);
    if (!videos.length && !playlists.length && !channels.length) {
      container.innerHTML += "<p>No YouTube results found. Try adding more common skills.</p>";
    }
    
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    container.innerHTML += "<p>Could not load recommendations.</p>";
  }
}

// Render recommendations
function renderRecommendations(type, items) {
  const container = document.getElementById("recommendation-wrapper");


  const section = document.createElement("div");
  section.classList.add("recommendation-section");
  section.id = `section-${type.toLowerCase()}`;
  section.innerHTML = `<h4>${type}</h4>`;

  const itemWrapper = document.createElement("div");
  itemWrapper.classList.add("item-wrapper");

  items.forEach((item, index) => {
    const id = item.id.videoId || item.id.playlistId || item.id.channelId;
    const kind = item.id.kind;
    let url = "";

    if (kind.includes("video")) {
      url = `https://www.youtube.com/watch?v=${id}`;
    } else if (kind.includes("playlist")) {
      url = `https://www.youtube.com/playlist?list=${id}`;
    } else if (kind.includes("channel")) {
      url = `https://www.youtube.com/channel/${id}`;
    }

    const thumbnail = item.snippet.thumbnails?.medium?.url || "https://via.placeholder.com/100x70?text=No+Image";

    const el = document.createElement("div");
    el.classList.add("recommendation-item");
    if (index >= 3) el.classList.add("hidden-item");

    el.innerHTML = `
      <a href="${url}" target="_blank" rel="noopener noreferrer">
        <img src="${thumbnail}" alt="${item.snippet.title}" />
        <p>${item.snippet.title}</p>
      </a>
    `;

    itemWrapper.appendChild(el);
  });

  section.appendChild(itemWrapper);

  if (items.length > 3) {
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

// ----------- Skill Editor Logic ----------- //
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

document.getElementById("save-skills-btn").addEventListener("click", async () => {
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
});
