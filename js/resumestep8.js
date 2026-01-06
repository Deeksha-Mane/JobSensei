// Debug logging
console.log("Additional information form script loaded");

// Function to handle form submission
document
  .getElementById("additional-info-form")
  .addEventListener("submit", function (e) {
    console.log("Form submitted");
    e.preventDefault();

    // Get languages data
    const languageEntries = document.querySelectorAll(".language-entry");
    const languages = [];
    languageEntries.forEach((entry) => {
      const language = {
        name: entry.querySelector(".language-name").value.trim(),
        proficiency: entry.querySelector(".language-proficiency").value,
      };
      languages.push(language);
    });

    // Get interests data
    const interests = {
      professional: document
        .getElementById("professional-interests")
        .value.trim(),
      personal: document.getElementById("personal-interests").value.trim(),
    };

    // Get volunteer work data
    const volunteerEntries = document.querySelectorAll(".volunteer-entry");
    const volunteerWork = [];
    volunteerEntries.forEach((entry) => {
      const volunteer = {
        organization: entry.querySelector(".volunteer-org").value.trim(),
        role: entry.querySelector(".volunteer-role").value.trim(),
        startDate: entry.querySelector(".volunteer-start-date").value,
        endDate: entry.querySelector(".volunteer-end-date").value,
        description: entry.querySelector(".volunteer-description").value.trim(),
      };
      volunteerWork.push(volunteer);
    });

    // Get references data
    const referenceAvailability = document.getElementById(
      "reference-availability"
    ).value;
    const references = [];
    if (referenceAvailability === "included") {
      const referenceEntries = document.querySelectorAll(".reference-entry");
      referenceEntries.forEach((entry) => {
        const reference = {
          name: entry.querySelector(".reference-name").value.trim(),
          title: entry.querySelector(".reference-title").value.trim(),
          company: entry.querySelector(".reference-company").value.trim(),
          email: entry.querySelector(".reference-email").value.trim(),
          phone: entry.querySelector(".reference-phone").value.trim(),
        };
        references.push(reference);
      });
    }

    // Combine all data
    const data = {
      languages: languages,
      interests: interests,
      volunteerWork: volunteerWork,
      referenceAvailability: referenceAvailability,
      references: references,
    };

    console.log("Additional information data:", data);
    localStorage.setItem("additionalInfo", JSON.stringify(data));
    console.log("Data saved to localStorage");

    // Redirect to preview page
    window.location.href = "resumepreview.html";
  });

// Function to add new language entry
document.getElementById("add-language").addEventListener("click", function () {
  const template = document.getElementById("language-template");
  const container = document.getElementById("languages-container");
  const clone = template.content.cloneNode(true);

  // Add remove button functionality
  const removeButton = clone.querySelector(".btn-remove");
  removeButton.addEventListener("click", function () {
    this.closest(".language-entry").remove();
  });

  container.appendChild(clone);
  console.log("New language entry added");
});

// Function to add new volunteer entry
document.getElementById("add-volunteer").addEventListener("click", function () {
  const template = document.getElementById("volunteer-template");
  const container = document.getElementById("volunteer-container");
  const clone = template.content.cloneNode(true);

  // Add remove button functionality
  const removeButton = clone.querySelector(".btn-remove");
  removeButton.addEventListener("click", function () {
    this.closest(".volunteer-entry").remove();
  });

  // Handle current volunteer checkbox
  const currentVolunteerCheckbox = clone.querySelector(".current-volunteer");
  const endDateInput = clone.querySelector(".volunteer-end-date");

  currentVolunteerCheckbox.addEventListener("change", function () {
    endDateInput.disabled = this.checked;
    if (this.checked) {
      endDateInput.value = "";
    }
  });

  container.appendChild(clone);
  console.log("New volunteer entry added");
});

// Handle reference availability selection
document
  .getElementById("reference-availability")
  .addEventListener("change", function () {
    const referencesContainer = document.getElementById("references-container");
    const addReferenceButton = document.getElementById("add-reference");

    if (this.value === "included") {
      referencesContainer.style.display = "block";
      addReferenceButton.style.display = "block";
    } else {
      referencesContainer.style.display = "none";
      addReferenceButton.style.display = "none";
    }
  });

// Function to add new reference entry
document.getElementById("add-reference").addEventListener("click", function () {
  const template = document.getElementById("reference-template");
  const container = document.getElementById("references-container");
  const clone = template.content.cloneNode(true);

  // Add remove button functionality
  const removeButton = clone.querySelector(".btn-remove");
  removeButton.addEventListener("click", function () {
    this.closest(".reference-entry").remove();
  });

  container.appendChild(clone);
  console.log("New reference entry added");
});

// Add error handling
window.addEventListener("error", function (e) {
  console.error("Error:", e.message);
});
