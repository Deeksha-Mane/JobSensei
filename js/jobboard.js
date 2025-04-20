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
    {
      title: "Senior Backend Engineer",
      company: "TechForge",
      location: "Hyderabad",
      type: "Full-time",
      tags: ["Node.js", "Express", "MongoDB"],


    },
    {
      title: "Backend Developer",
      company: "DataNest",
      location: "Remote",
      type: "Contract",
      tags: ["Python", "Django", "PostgreSQL"],
    },
    {
      title: "Software Engineer - Backend",
      company: "InnovApp",
      location: "Mumbai",
      type: "Full-time",
      tags: ["Go", "Microservices", "Docker"],
    },
    {
      title: "Backend API Developer",
      company: "CloudStack",
      location: "Chennai",
      type: "Part-time",
      tags: ["Ruby", "Rails", "AWS"],
    },
    {
      title: "Platform Engineer",
      company: "StackLoop",
      location: "Pune",
      type: "Full-time",
      tags: ["Java", "Spring Boot", "Kubernetes"],
    },
    {
      title: "Backend Software Engineer",
      company: "NeoTech Labs",
      location: "Delhi NCR",
      type: "Full-time",
      tags: ["C#", ".NET Core", "Azure"],
    },
    {
      title: "DevOps Engineer",
      company: "BuildOps",
      location: "Pune",
      type: "Full-time",
      tags: ["Docker", "Kubernetes", "CI/CD"],
    },
    {
      title: "Machine Learning Engineer",
      company: "AIWorks",
      location: "Hyderabad",
      type: "Full-time",
      tags: ["Python", "Scikit-learn", "AWS SageMaker"],
    },
    {
      title: "Junior Backend Developer",
      company: "Bitcrunch",
      location: "Bangalore",
      type: "Internship",
      tags: ["Node.js", "Express", "MongoDB"],
    },
    {
      title: "API Integration Specialist",
      company: "ZapSync",
      location: "Remote",
      type: "Part-time",
      tags: ["REST", "OAuth", "GraphQL"],
    }    
  ];
  let filteredJobs = [...jobs];
  let visibleCount = 6;

  function renderJobs() {
    jobCardsContainer.innerHTML = "";
    const jobsToShow = filteredJobs.slice(0, visibleCount);

    jobsToShow.forEach((job) => {
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

    // Show or hide the button
    if (visibleCount >= filteredJobs.length) {
      showMoreBtn.style.display = "none";
    } else {
      showMoreBtn.style.display = "block";
    }
  }

  function filterJobs() {
    const search = document.getElementById("jobSearch").value.toLowerCase();
    const location = document.getElementById("locationFilter").value;
    const type = document.getElementById("typeFilter").value;

    filteredJobs = jobs.filter((job) => {
      const matchSearch = job.title.toLowerCase().includes(search);
      const matchLocation = location ? job.location === location : true;
      const matchType = type ? job.type === type : true;
      return matchSearch && matchLocation && matchType;
    });

    visibleCount = 4; // Reset count
    renderJobs();
  }

  document.getElementById("jobSearch").addEventListener("input", filterJobs);
  document.getElementById("locationFilter").addEventListener("change", filterJobs);
  document.getElementById("typeFilter").addEventListener("change", filterJobs);

  showMoreBtn.addEventListener("click", () => {
    visibleCount += 6;
    renderJobs();
  });

  renderJobs(); // Initial render
});