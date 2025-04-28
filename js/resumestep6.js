// Debug logging
console.log("Projects form script loaded");

// Function to handle form submission
document
  .getElementById("projects-form")
  .addEventListener("submit", function (e) {
    console.log("Form submitted");
    e.preventDefault();

    // Get all project entries
    const projectEntries = document.querySelectorAll(".project-entry");
    const projects = [];

    projectEntries.forEach((entry, index) => {
      const project = {
        title: entry.querySelector(".project-title").value.trim(),
        type: entry.querySelector(".project-type").value,
        url: entry.querySelector(".project-url").value.trim(),
        description: entry.querySelector(".project-description").value.trim(),
        technologies: entry.querySelector(".technologies").value.trim(),
        features: entry.querySelector(".features").value.trim(),
        startDate: entry.querySelector(".start-date").value,
        endDate: entry.querySelector(".end-date").value,
        ongoing: entry.querySelector(".ongoing").checked,
      };
      projects.push(project);
    });

    console.log("Projects data:", projects);
    localStorage.setItem("projects", JSON.stringify(projects));
    console.log("Data saved to localStorage");

    // Redirect to next step
    window.location.href = "resumestep7.html";
  });

// Function to add new project entry
document.getElementById("add-project").addEventListener("click", function () {
  const template = document.getElementById("project-template");
  const container = document.getElementById("projects-container");
  const clone = template.content.cloneNode(true);

  // Add remove button functionality
  const removeButton = clone.querySelector(".btn-remove");
  removeButton.addEventListener("click", function () {
    this.closest(".project-entry").remove();
  });

  // Add ongoing checkbox functionality
  const ongoingCheckbox = clone.querySelector(".ongoing");
  const endDateInput = clone.querySelector(".end-date");

  ongoingCheckbox.addEventListener("change", function () {
    endDateInput.disabled = this.checked;
    if (this.checked) {
      endDateInput.value = "";
    }
  });

  container.appendChild(clone);
  console.log("New project entry added");
});

// Add error handling
window.addEventListener("error", function (e) {
  console.error("Error:", e.message);
});

// Debug logging
console.log("Step 6 script loaded");

// DOM Elements
const volunteerForm = document.getElementById("volunteer-form");
const volunteerContainer = document.getElementById("volunteer-container");
const validationMessage = document.getElementById("volunteer-validation");

// Add new volunteer entry
function addVolunteerEntry() {
  const entryCount = volunteerContainer.children.length + 1;
  const newEntry = document.createElement("div");
  newEntry.className = "volunteer-entry";
  newEntry.innerHTML = `
    <div class="volunteer-header">
      <h3>Volunteer Experience #${entryCount}</h3>
      <button
        type="button"
        class="btn-remove"
        onclick="this.closest('.volunteer-entry').remove()"
      >
        Remove
      </button>
    </div>

    <div class="form-group">
      <label for="organization-${entryCount}">Organization Name</label>
      <input
        type="text"
        name="organization"
        id="organization-${entryCount}"
        required
        placeholder="Enter organization name"
      />
    </div>

    <div class="form-group">
      <label for="role-${entryCount}">Role/Position</label>
      <input
        type="text"
        name="role"
        id="role-${entryCount}"
        required
        placeholder="Enter your role/position"
      />
    </div>

    <div class="form-group">
      <label for="description-${entryCount}">Description</label>
      <textarea
        name="description"
        id="description-${entryCount}"
        required
        placeholder="Describe your responsibilities and achievements"
        rows="4"
      ></textarea>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="start-date-${entryCount}">Start Date</label>
        <input type="month" name="start-date" id="start-date-${entryCount}" required />
      </div>

      <div class="form-group">
        <label for="end-date-${entryCount}">End Date</label>
        <input type="month" name="end-date" id="end-date-${entryCount}" />
        <label class="checkbox-label">
          <input type="checkbox" name="ongoing" id="ongoing-${entryCount}" /> Ongoing
        </label>
      </div>
    </div>

    <div class="form-group">
      <label for="skills-${entryCount}">Skills Gained</label>
      <input
        type="text"
        name="skills"
        id="skills-${entryCount}"
        placeholder="e.g., Leadership, Event Planning, Communication"
      />
    </div>
  `;

  volunteerContainer.appendChild(newEntry);
  setupOngoingCheckbox(newEntry);
}

// Handle ongoing checkbox
function setupOngoingCheckbox(entry) {
  const ongoingCheckbox = entry.querySelector('input[name="ongoing"]');
  const endDateInput = entry.querySelector('input[name="end-date"]');

  ongoingCheckbox.addEventListener("change", function () {
    endDateInput.disabled = this.checked;
    if (this.checked) {
      endDateInput.value = "";
    }
  });
}

// Show validation message
function showValidation(message, isError = true) {
  validationMessage.textContent = message;
  validationMessage.className = `validation-message ${
    isError ? "error" : "success"
  } show`;
  setTimeout(() => {
    validationMessage.className = "validation-message";
  }, 3000);
}

// Handle form submission
volunteerForm.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("Volunteer form submitted");

  const volunteerEntries = Array.from(volunteerContainer.children).map(
    (entry) => {
      const ongoing = entry.querySelector('input[name="ongoing"]').checked;
      return {
        organization: entry.querySelector('input[name="organization"]').value,
        role: entry.querySelector('input[name="role"]').value,
        description: entry.querySelector('textarea[name="description"]').value,
        startDate: entry.querySelector('input[name="start-date"]').value,
        endDate: ongoing
          ? "Present"
          : entry.querySelector('input[name="end-date"]').value,
        skills: entry.querySelector('input[name="skills"]').value,
      };
    }
  );

  try {
    localStorage.setItem(
      "volunteerExperience",
      JSON.stringify(volunteerEntries)
    );
    console.log("Volunteer experience saved:", volunteerEntries);
    showValidation("Volunteer experience saved successfully!", false);
    setTimeout(() => {
      window.location.href = "resumestep7.html";
    }, 1000);
  } catch (error) {
    console.error("Error saving volunteer experience:", error);
    showValidation("Error saving volunteer experience. Please try again.");
  }
});

// Initialize ongoing checkboxes for existing entries
document.querySelectorAll(".volunteer-entry").forEach(setupOngoingCheckbox);
