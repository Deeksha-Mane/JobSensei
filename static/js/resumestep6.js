console.log("resumestep6.js loaded");

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded");

  // DOM Elements
  const volunteerForm = document.getElementById("volunteer-form");
  const volunteerContainer = document.getElementById("volunteer-container");
  const addButton = document.getElementById("add-volunteer");

  if (!volunteerForm || !volunteerContainer || !addButton) {
    console.error("Required elements not found!");
    return;
  }

  // Create validation message element
  const validationMessage = document.createElement("div");
  validationMessage.id = "volunteer-validation";
  validationMessage.className = "validation-message";
  document.querySelector(".form-container").appendChild(validationMessage);

  // Add new volunteer entry
  function addVolunteerEntry() {
    console.log("Adding new volunteer entry");
    const entryCount = volunteerContainer.children.length + 1;
    const newEntry = document.createElement("div");
    newEntry.className = "volunteer-entry";
    newEntry.innerHTML = `
            <div class="volunteer-header">
                <h3>Volunteer Experience #${entryCount}</h3>
                <button type="button" class="btn-remove" onclick="this.closest('.volunteer-entry').remove()">
                    Remove
                </button>
            </div>
            <div class="form-group">
                <label for="organization-${entryCount}">Organization Name</label>
                <input type="text" name="organization" id="organization-${entryCount}" required placeholder="Enter organization name" />
            </div>
            <div class="form-group">
                <label for="role-${entryCount}">Role/Position</label>
                <input type="text" name="role" id="role-${entryCount}" required placeholder="Enter your role/position" />
            </div>
            <div class="form-group">
                <label for="description-${entryCount}">Description</label>
                <textarea name="description" id="description-${entryCount}" required placeholder="Describe your responsibilities and achievements"></textarea>
            </div>
            <div class="form-group">
                <label for="start-date-${entryCount}">Start Date</label>
                <input type="month" name="start-date" id="start-date-${entryCount}" required />
            </div>
            <div class="form-group">
                <label for="end-date-${entryCount}">End Date</label>
                <input type="month" name="end-date" id="end-date-${entryCount}" />
                <label class="checkbox-label">
                    <input type="checkbox" name="ongoing" id="ongoing-${entryCount}" onchange="setupOngoingCheckbox(this)" />
                    Currently volunteering
                </label>
            </div>
        `;
    volunteerContainer.appendChild(newEntry);
    setupOngoingCheckbox(newEntry.querySelector(`#ongoing-${entryCount}`));
  }

  // Setup ongoing checkbox functionality
  function setupOngoingCheckbox(checkbox) {
    const endDateInput = checkbox
      .closest(".form-group")
      .querySelector("input[type='month']");
    endDateInput.disabled = checkbox.checked;
    if (checkbox.checked) {
      endDateInput.value = "";
    }
  }

  // Show validation message
  function showValidation(message, isError = true) {
    validationMessage.textContent = message;
    validationMessage.className = `validation-message ${
      isError ? "error" : "success"
    }`;
    validationMessage.style.display = "block";
    setTimeout(() => {
      validationMessage.style.display = "none";
    }, 3000);
  }

  // Add event listeners
  addButton.addEventListener("click", addVolunteerEntry);

  // Form submission handler
  volunteerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Form submitted");

    try {
      const volunteerData = [];
      const entries = volunteerContainer.querySelectorAll(".volunteer-entry");

      if (entries.length === 0) {
        showValidation("Please add at least one volunteer experience");
        return;
      }

      let isValid = true;
      entries.forEach((entry) => {
        const organization = entry.querySelector("[name='organization']").value;
        const role = entry.querySelector("[name='role']").value;
        const description = entry.querySelector("[name='description']").value;
        const startDate = entry.querySelector("[name='start-date']").value;
        const endDate = entry.querySelector("[name='end-date']").value;
        const ongoing = entry.querySelector("[name='ongoing']").checked;

        // Validate required fields
        if (
          !organization ||
          !role ||
          !description ||
          !startDate ||
          (!endDate && !ongoing)
        ) {
          isValid = false;
          showValidation(
            "Please fill in all required fields for each volunteer experience"
          );
          return;
        }

        volunteerData.push({
          organization,
          role,
          description,
          startDate,
          endDate: ongoing ? "Present" : endDate,
          ongoing,
        });
      });

      if (!isValid) {
        return;
      }

      // Send data to server
      fetch("/resume-builder/step/6", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(volunteerData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Save to localStorage as backup
            localStorage.setItem(
              "volunteerData",
              JSON.stringify(volunteerData)
            );
            console.log("Volunteer data saved:", volunteerData);

            // Show success message
            showValidation("Volunteer experience saved successfully!", false);

            // Redirect to next step
            window.location.href = data.redirect;
          } else {
            throw new Error(data.error || "Failed to save data");
          }
        })
        .catch((error) => {
          console.error("Error saving volunteer data:", error);
          showValidation("An error occurred while saving your data");
        });
    } catch (error) {
      console.error("Error processing form:", error);
      showValidation("An error occurred while processing the form");
    }
  });

  // Add initial volunteer entry
  addVolunteerEntry();
});
