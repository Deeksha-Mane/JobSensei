document.getElementById('experience-info-form').addEventListener('submit', function(e) {
    e.preventDefault();
  
    // Save experience data to local storage
    const experienceInfo = {
      company: document.getElementById('company').value,
      role: document.getElementById('role').value,
      startDate: document.getElementById('startDate').value,
      endDate: document.getElementById('endDate').value
    };
    localStorage.setItem('experienceInfo', JSON.stringify(experienceInfo));
  
    // Redirect to next step (step 4)
    window.location.href = 'resumestep4.html';
  });
  