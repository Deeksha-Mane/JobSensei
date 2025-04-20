from flask import Flask, render_template, request
from sentence_transformers import SentenceTransformer, util

# Initialize Flask app and model
app = Flask(__name__)
model = SentenceTransformer('all-MiniLM-L6-v2')

# List of careers with descriptions
careers = [
    "Data Scientist: Analyzes data to extract meaningful insights.",
    "Web Developer: Builds user-facing websites and apps.",
    "Mechanical Engineer: Designs and manufactures machines.",
    "AI Researcher: Develops intelligent algorithms and neural networks.",
    "Graphic Designer: Creates visual designs for brands and media.",
    "Cybersecurity Analyst: Protects systems from digital threats.",
    "Product Manager: Coordinates between teams to build the right products.",
    "Content Writer: Writes blog posts, articles, and marketing content."
]

# Function to get career recommendation
def get_career_recommendation(user_input):
    # Encode the user input and career options
    user_embedding = model.encode(user_input, convert_to_tensor=True)
    career_embeddings = model.encode(careers, convert_to_tensor=True)

    # Compute cosine similarities
    cosine_scores = util.pytorch_cos_sim(user_embedding, career_embeddings)

    # Find the best match
    best_match_index = cosine_scores.argmax()
    return careers[best_match_index]

# Route to display the form page
@app.route('/')
def index():
    return render_template('pages/index.html')

# Route to handle form submission
@app.route('/predict', methods=['POST'])
def predict():
    # Get user input from the form
    user_input = request.form['skills']

    # Get career recommendation based on input
    recommendation = get_career_recommendation(user_input)

    return render_template('pages/index.html', recommendation=recommendation)

if __name__ == '__main__':
    app.run(debug=True)
