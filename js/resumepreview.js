window.onload = function () {
  // Personal Info
  const personalInfo = JSON.parse(localStorage.getItem('personalInfo')) || {};
  document.getElementById('previewName').textContent = personalInfo.fullName || 'Your Name';
  document.getElementById('previewEmail').textContent = personalInfo.email || '';
  document.getElementById('previewPhone').textContent = personalInfo.phone || '';
  document.getElementById('previewAddress').textContent = personalInfo.address || '';

  // Education Info
  const educationInfo = JSON.parse(localStorage.getItem('educationInfo')) || {};
  document.getElementById('previewEducation').textContent =
    `${educationInfo.degree || ''}, ${educationInfo.institution || ''}, ${educationInfo.graduationYear || ''}`;

  // Experience Info
  const experienceInfo = JSON.parse(localStorage.getItem('experienceInfo')) || {};
  document.getElementById('previewExperience').textContent =
    `${experienceInfo.role || ''} at ${experienceInfo.company || ''} (${experienceInfo.startDate || ''} - ${experienceInfo.endDate || ''})`;

  // Skills
  const skills = JSON.parse(localStorage.getItem('skills')) || [];
  document.getElementById('previewSkills').textContent = skills.join(', ');

  // Projects
  const projectContainer = document.getElementById('previewProjects');
  const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];

  if (storedProjects.length > 0) {
    storedProjects.forEach(project => {
      const projectDiv = document.createElement('div');
      projectDiv.classList.add('project-entry');
      projectDiv.innerHTML = `
        <p><strong>${project.title}</strong></p>
        <p><strong>Description:</strong> ${project.description}</p>
        <p><strong>Technologies:</strong> ${project.technologies}</p>
      `;
      projectContainer.appendChild(projectDiv);
    });
  } else {
    projectContainer.innerHTML = `<p>No projects added.</p>`;
  }
};

// Download PDF
function downloadPDF() {
  const element = document.getElementById('resumePreview');

  const opt = {
    margin:       0,
    filename:     'My_Resume.pdf',
    image:        { type: 'jpeg', quality: 0.95 },
    html2canvas:  {
      scale: 1.5,
      scrollY: 0
    },
    jsPDF:        {
      unit: 'pt',
      format: 'a4',
      orientation: 'portrait'
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  html2pdf().set(opt).from(element).save();
}
