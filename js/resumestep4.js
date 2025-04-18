let skills = [];

function addSkill() {
  const skillInput = document.getElementById("skillInput");
  const skill = skillInput.value.trim();

  if (skill && !skills.includes(skill)) {
    skills.push(skill);
    renderSkills();
    skillInput.value = "";
  }
}

function renderSkills() {
  const skillsList = document.getElementById("skills-list");
  skillsList.innerHTML = skills
    .map(
      (s, i) =>
        `<div class="skill-chip">${s}<span onclick="removeSkill(${i})">&times;</span></div>`
    )
    .join("");
}

function removeSkill(index) {
  skills.splice(index, 1);
  renderSkills();
}

const skillsForm = document.getElementById("skills-form");
if (skillsForm) {
  skillsForm.addEventListener("submit", function (e) {
    e.preventDefault();
    localStorage.setItem("skills", JSON.stringify(skills));
    window.location.href = "resumestep5.html";
  });
}
