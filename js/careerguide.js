document.getElementById('skillForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const skillsInput = document.getElementById('skills').value.trim().toLowerCase();
    const careerSuggestions = [];
    const courseSuggestions = [];

    // Match skills and add suggestions accordingly
    if (skillsInput.includes("python") || skillsInput.includes("machine learning")) {
        careerSuggestions.push("AI Engineer", "Data Scientist");
        courseSuggestions.push(
            "Introduction to Machine Learning - Coursera",
            "Deep Learning Specialization - Coursera"
        );
    }

    if (skillsInput.includes("data analysis") || skillsInput.includes("statistics")) {
        careerSuggestions.push("Data Analyst", "Business Intelligence Analyst");
        courseSuggestions.push(
            "Data Analysis with Python - DataCamp",
            "Advanced Data Visualization with Python - Coursera"
        );
    }

    if (skillsInput.includes("nlp") || skillsInput.includes("natural language processing")) {
        careerSuggestions.push("NLP Engineer", "AI Research Scientist");
        courseSuggestions.push(
            "Natural Language Processing - Coursera",
            "Advanced NLP with TensorFlow - Udacity"
        );
    }

    if (skillsInput.includes("computer vision") || skillsInput.includes("opencv")) {
        careerSuggestions.push("Computer Vision Engineer", "AI Imaging Specialist");
        courseSuggestions.push(
            "Computer Vision Basics - Coursera",
            "Deep Learning for Computer Vision - Udacity"
        );
    }

    if (skillsInput.includes("sql") || skillsInput.includes("database")) {
        careerSuggestions.push("Data Engineer", "Database Administrator");
        courseSuggestions.push(
            "SQL for Data Science - Coursera",
            "Relational Databases and SQL - edX"
        );
    }

    if (skillsInput.includes("java") || skillsInput.includes("software")) {
        careerSuggestions.push("AI Software Developer", "Machine Learning Developer");
        courseSuggestions.push(
            "Java for Data Science - Coursera",
            "Building Scalable AI Systems - edX"
        );
    }

    // Default fallback suggestion
    if (careerSuggestions.length === 0) {
        careerSuggestions.push("AI Enthusiast", "AI Intern");
        courseSuggestions.push(
            "AI For Everyone - Coursera",
            "Foundations of Artificial Intelligence - edX"
        );
    }

    // Show recommendation section
    document.getElementById('recommendations').style.display = 'block';

    // Populate career suggestions
    const careerSuggestionsContainer = document.getElementById('career-suggestions');
    careerSuggestionsContainer.innerHTML = "";
    careerSuggestions.forEach(career => {
        const card = document.createElement('div');
        card.className = 'career-card';
        card.innerHTML = `<h4>${career}</h4><p>Explore this exciting career in AI.</p>`;
        careerSuggestionsContainer.appendChild(card);
    });

    // Populate course suggestions
    const courseSuggestionsContainer = document.getElementById('course-suggestions');
    courseSuggestionsContainer.innerHTML = "";
    courseSuggestions.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `<h4>${course.split(" - ")[0]}</h4><p>${course.split(" - ")[1]}</p>`;
        courseSuggestionsContainer.appendChild(card);
    });
});
    