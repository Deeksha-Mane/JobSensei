document.addEventListener("DOMContentLoaded", () => {
  const jobCardsContainer = document.getElementById("jobCards");

  // Sample job data for demonstration
  const jobs = [
    {
      title: "Frontend Developer Intern",
      company: "Nova",
      location: "Remote",
      type: "Internship",
      tags: ["React", "CSS", "JavaScript"],
    },
    {
      title: "AI Research Assistant",
      company: "DeepVision",
      location: "Bangalore",
      type: "Internship",
      tags: ["Python", "ML", "TensorFlow"],
    },
    {
      title: "Full Stack Developer",
      company: "CloudX",
      location: "Mumbai",
      type: "Full-time",
      tags: ["Node.js", "MongoDB", "Firebase"],
    },
    {
      title: "Data Scientist",
      company: "DataSolutions",
      location: "Remote",
      type: "Full-time",
      tags: ["Python", "Data Analysis", "SQL"],
    },
    {
      title: "Backend Developer",
      company: "CodeBase",
      location: "Bangalore",
      type: "Full-time",
      tags: ["Java", "Spring Boot", "AWS"],
    },
  ];

  // Function to filter jobs based on user input
  const filterJobs = () => {
    const searchValue = document
      .getElementById("jobSearch")
      .value.toLowerCase();
    const locationValue = document.getElementById("locationFilter").value;
    const typeValue = document.getElementById("typeFilter").value;

    const filteredJobs = jobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(searchValue);
      const matchesLocation = locationValue
        ? job.location === locationValue
        : true;
      const matchesType = typeValue ? job.type === typeValue : true;

      return matchesSearch && matchesLocation && matchesType;
    });

    renderJobs(filteredJobs);
  };

  // Render job cards based on filtered job data
  const renderJobs = (jobList) => {
    jobCardsContainer.innerHTML = ""; // Clear existing job cards
    jobList.forEach((job) => {
      const card = document.createElement("div");
      card.className = "job-card";
      card.innerHTML = `
          <h3 class="job-title">${job.title}</h3>
          <p class="job-info"><strong>${job.company}</strong> | ${job.location} | ${job.type}</p>
          <div class="job-tags">
            ${job.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
          </div>
          <button class="apply-btn">Apply Now</button>
        `;
      jobCardsContainer.appendChild(card);
    });
  };

  // Initial render of all jobs
  renderJobs(jobs);

  // Event listeners for filter changes
  document.getElementById("jobSearch").addEventListener("input", filterJobs);
  document
    .getElementById("locationFilter")
    .addEventListener("change", filterJobs);
  document.getElementById("typeFilter").addEventListener("change", filterJobs);
});
