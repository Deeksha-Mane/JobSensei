document.getElementById('education-info-form').addEventListener('submit', function(e) {
    e.preventDefault();
  
    // Save education info data to local storage
    const educationInfo = {
      degree: document.getElementById('degree').value,
      institution: document.getElementById('institution').value,
      graduationYear: document.getElementById('graduationYear').value
    };
    localStorage.setItem('educationInfo', JSON.stringify(educationInfo));
  
    // Redirect to next step (step 3)
    window.location.href = 'resumestep3.html';
  });
  