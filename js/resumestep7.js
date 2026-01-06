// Debug logging
console.log("Certifications and achievements form script loaded");

// Function to handle form submission
document
  .getElementById("certifications-form")
  .addEventListener("submit", function (e) {
    console.log("Form submitted");
    e.preventDefault();

    // Get all certification entries
    const certificationEntries = document.querySelectorAll(
      ".certification-entry"
    );
    const certifications = [];

    certificationEntries.forEach((entry, index) => {
      const certification = {
        name: entry.querySelector(".certification-name").value.trim(),
        organization: entry.querySelector(".issuing-org").value.trim(),
        issueDate: entry.querySelector(".issue-date").value,
        expirationDate: entry.querySelector(".expiration-date").value,
        noExpiration: entry.querySelector(".no-expiration").checked,
        credentialId: entry.querySelector(".credential-id").value.trim(),
      };
      certifications.push(certification);
    });

    // Get all achievement entries
    const achievementEntries = document.querySelectorAll(".achievement-entry");
    const achievements = [];

    achievementEntries.forEach((entry, index) => {
      const achievement = {
        title: entry.querySelector(".achievement-title").value.trim(),
        date: entry.querySelector(".achievement-date").value,
        description: entry
          .querySelector(".achievement-description")
          .value.trim(),
        organization: entry.querySelector(".issuing-org").value.trim(),
      };
      achievements.push(achievement);
    });

    const data = {
      certifications: certifications,
      achievements: achievements,
    };

    console.log("Certifications and achievements data:", data);
    localStorage.setItem("certificationsAndAchievements", JSON.stringify(data));
    console.log("Data saved to localStorage");

    // Redirect to next step
    window.location.href = "resumestep8.html";
  });

// Function to add new certification entry
document
  .getElementById("add-certification")
  .addEventListener("click", function () {
    const template = document.getElementById("certification-template");
    const container = document.getElementById("certifications-container");
    const clone = template.content.cloneNode(true);

    // Add remove button functionality
    const removeButton = clone.querySelector(".btn-remove");
    removeButton.addEventListener("click", function () {
      this.closest(".certification-entry").remove();
    });

    // Add no expiration checkbox functionality
    const noExpirationCheckbox = clone.querySelector(".no-expiration");
    const expirationDateInput = clone.querySelector(".expiration-date");

    noExpirationCheckbox.addEventListener("change", function () {
      expirationDateInput.disabled = this.checked;
      if (this.checked) {
        expirationDateInput.value = "";
      }
    });

    container.appendChild(clone);
    console.log("New certification entry added");
  });

// Function to add new achievement entry
document
  .getElementById("add-achievement")
  .addEventListener("click", function () {
    const template = document.getElementById("achievement-template");
    const container = document.getElementById("achievements-container");
    const clone = template.content.cloneNode(true);

    // Add remove button functionality
    const removeButton = clone.querySelector(".btn-remove");
    removeButton.addEventListener("click", function () {
      this.closest(".achievement-entry").remove();
    });

    container.appendChild(clone);
    console.log("New achievement entry added");
  });

// Add error handling
window.addEventListener("error", function (e) {
  console.error("Error:", e.message);
});
