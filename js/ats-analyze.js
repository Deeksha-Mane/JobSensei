// Function to analyze the resume file and calculate ATS score
function analyzeResume() {
    const fileInput = document.getElementById('resumeFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please upload a resume first!');
        return;
    }

    // Parse the PDF file using pdf.js
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const pdfData = new Uint8Array(event.target.result);

        // Ensure pdf.js is loaded and available
        if (typeof pdfjsLib === 'undefined') {
            alert('Error: pdf.js library is not loaded!');
            return;
        }

        pdfjsLib.getDocument(pdfData).promise.then(function(pdf) {
            let textContent = '';
            
            // Extract text from each page of the PDF
            const numPages = pdf.numPages;
            let pagePromises = [];

            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                pagePromises.push(pdf.getPage(pageNum).then(function(page) {
                    return page.getTextContent().then(function(text) {
                        text.items.forEach(function(item) {
                            textContent += item.str + ' ';
                        });
                    });
                }));
            }

            // Once all pages are processed, calculate ATS score
            Promise.all(pagePromises).then(function() {
                const atsScore = calculateATSScore(textContent);
                displayATSResult(atsScore);
            });
        });
    };
    
    fileReader.readAsArrayBuffer(file);
}

// Dummy ATS scoring function
function calculateATSScore(text) {
    let score = 100;
    
    // Example logic: Subtract points if certain keywords are missing
    if (!text.includes('JavaScript')) {
        score -= 20;
    }
    
    if (!text.includes('Python')) {
        score -= 20;
    }

    return score;
}

// Display ATS score and feedback
function displayATSResult(atsScore) {
    const atsScoreElement = document.getElementById('atsScore');
    const feedbackElement = document.getElementById('feedback');
    
    atsScoreElement.innerText = atsScore;

    let feedback = 'Your resume looks good!';
    
    if (atsScore <= 10) {
        feedback = 'Your resume needs significant work. It lacks essential skills and relevant keywords. Focus on adding key skills and job-specific experiences to improve your chances with ATS.';
    } else if (atsScore <= 20) {
        feedback = 'Your resume is not yet optimized for ATS. Consider adding more relevant skills, qualifications, and job-specific keywords. Tailor your resume to the job description for better results.';
    } else if (atsScore <= 30) {
        feedback = 'Your resume is still missing key elements needed to pass through ATS. You need to focus on relevant job skills, achievements, and keywords that match the job description more closely.';
    } else if (atsScore <= 40) {
        feedback = 'Your resume needs improvements. Make sure to include relevant skills, experiences, and keywords that are directly related to the job. Start focusing on keyword optimization.';
    } else if (atsScore <= 50) {
        feedback = 'Consider making your resume more ATS-friendly. Add more relevant job-specific keywords and focus on clearly highlighting your skills and achievements.';
    } else if (atsScore <= 60) {
        feedback = 'Good start! However, your resume can still be improved by adding more relevant skills and job-specific experiences. Focus on tailoring it to the specific job description.';
    } else if (atsScore <= 70) {
        feedback = 'Good job! Your resume is fairly optimized, but consider adding more job-specific keywords and quantifiable achievements to increase its ATS score and better match job requirements.';
    } else if (atsScore <= 80) {
        feedback = 'Nice work! Your resume looks solid. Focus on highlighting more relevant skills, achievements, and experiences that match the job description to make it more ATS-friendly.';
    } else if (atsScore <= 90) {
        feedback = 'Great job! Your resume is highly optimized for ATS. Try adding a few more quantifiable achievements and additional relevant keywords to ensure maximum compatibility.';
    } else if (atsScore <= 95) {
        feedback = 'Excellent! Your resume is very well optimized for ATS. Consider reviewing the formatting and adding even more specific keywords to make sure you’re perfectly aligned with the job.';
    } else if (atsScore <= 100) {
        feedback = 'Perfect! Your resume is ATS-ready. It’s clear, concise, and optimized with the right keywords and skills. Keep up the great work!';
    }    

    feedbackElement.innerText = feedback;
    document.getElementById('atsResult').style.display = 'block'; // Show the result div
}

// Event listener for analyze button
document.getElementById('analyzeBtn').addEventListener('click', analyzeResume);