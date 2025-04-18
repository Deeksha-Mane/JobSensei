document.getElementById('personal-info-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Save personal info data to local storage (you can also save to a database here)
    const personalInfo = {
      fullName: document.getElementById('fullName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value
    };
    localStorage.setItem('personalInfo', JSON.stringify(personalInfo));
  
    // Redirect to next step (step 2)
    window.location.href = 'resumestep2.html';
  });  