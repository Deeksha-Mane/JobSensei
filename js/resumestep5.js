document.getElementById("projectForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const title = this.title.value.trim();
  const description = this.description.value.trim();
  const technologies = this.technologies.value.trim();

  if (!title || !description || !technologies) return;

  const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
  storedProjects.push({ title, description, technologies });
  localStorage.setItem("projects", JSON.stringify(storedProjects));

  const projectList = document.getElementById("projectList");
  const projectItem = document.createElement("div");
  projectItem.classList.add("project-item");
  projectItem.innerHTML = `
    <h3>${title}</h3>
    <p><strong>Description:</strong> ${description}</p>
    <p><strong>Technologies:</strong> ${technologies}</p>
  `;
  projectList.appendChild(projectItem);

  this.reset();
});
