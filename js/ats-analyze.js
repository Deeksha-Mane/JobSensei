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
    
    if (atsScore < 60) {
        feedback = 'Consider improving your resume by adding more relevant skills and experience.';
    } else if (atsScore < 80) {
        feedback = 'Good job! Focus on highlighting key skills for the position you are applying for.';
    }

    feedbackElement.innerText = feedback;
    document.getElementById('atsResult').style.display = 'block'; // Show the result div
}

// Event listener for analyze button
document.getElementById('analyzeBtn').addEventListener('click', analyzeResume);