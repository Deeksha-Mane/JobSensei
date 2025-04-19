// const functions = require("firebase-functions");
// const { GoogleAuth } = require("google-auth-library");
// const axios = require("axios");

// const PROJECT_ID = "jobsensei-84540"; // Replace with actual Firebase project ID
// const MODEL = "gemini-pro";
// const LOCATION = "us-central1"; // Free-tier supported location

// exports.getCareerRecommendation = functions.https.onCall(
//   async (data, context) => {
//     const prompt = createPrompt(data);

//     const auth = new GoogleAuth({
//       scopes: "https://www.googleapis.com/auth/cloud-platform",
//     });
//     const client = await auth.getClient();
//     const accessToken = await client.getAccessToken();

//     const response = await axios.post(
//       `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}:predict`,
//       {
//         instances: [{ prompt }],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken.token}`,
//         },
//       }
//     );

//     const recommendation = response.data.predictions[0].content;
//     return { recommendation };
//   }
// );

// function createPrompt(data) {
//   return `
// Based on the following answers to 17 career-focused questions, provide a personalized and thoughtful career recommendation that suits the individual’s personality, interests, values, and goals.

// 1. Subjects or activities enjoyed in free time: ${data.q1}
// 2. Preferred work environment: ${data.q2}
// 3. Work style preference (independent/team): ${data.q3}
// 4. Top 3 skills or talents: ${data.q4}
// 5. Most rewarding past tasks or projects: ${data.q5}
// 6. Work preference (creative, analytical, technical, people-oriented): ${data.q6}
// 7. Interested industries or fields: ${data.q7}
// 8. Career priority (salary, flexibility, social impact): ${data.q8}
// 9. Willingness to travel or relocate: ${data.q9}
// 10. Education level willing to pursue: ${data.q10}
// 11. Learning vs routine preference: ${data.q11}
// 12. Importance of work-life balance: ${data.q12}
// 13. Motivation (stability, growth, passion): ${data.q13}
// 14. 5-year professional vision: ${data.q14}
// 15. Preference (corporate, startup, self-employed): ${data.q15}
// 16. Comfort level with stress: ${data.q16}
// 17. Career curiosity not yet explored: ${data.q17}

// Please return a clear, well-structured recommendation explaining the suggested career path and why it's a good fit.
//   `;
// }



const functions = require("firebase-functions");
const { GoogleAuth } = require("google-auth-library");
const axios = require("axios");

const PROJECT_ID = "jobsensei-84540"; // Replace with actual Firebase project ID
const MODEL = "gemini-pro";
const LOCATION = "us-central1"; // Free-tier supported location

exports.getCareerRecommendation = functions.https.onCall(
  async (data, context) => {
    try {
      const prompt = createPrompt(data);

      const auth = new GoogleAuth({
        scopes: "https://www.googleapis.com/auth/cloud-platform",
      });
      const client = await auth.getClient();
      const accessToken = await client.getAccessToken();
      const token = typeof accessToken === "string" ? accessToken : accessToken.token;

      const response = await axios.post(
        `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}:predict`,
        {
          instances: [{ prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const recommendation = response.data.predictions[0].content;
      return { recommendation };
    } catch (error) {
      console.error("Error getting recommendation:", error.message);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to generate career recommendation. Try again later."
      );
    }
  }
);

function createPrompt(data) {
  return `
Based on the following answers to 17 career-focused questions, provide a personalized and thoughtful career recommendation that suits the individual’s personality, interests, values, and goals.

1. Subjects or activities enjoyed in free time: ${data.q1}
2. Preferred work environment: ${data.q2}
3. Work style preference (independent/team): ${data.q3}
4. Top 3 skills or talents: ${data.q4}
5. Most rewarding past tasks or projects: ${data.q5}
6. Work preference (creative, analytical, technical, people-oriented): ${data.q6}
7. Interested industries or fields: ${data.q7}
8. Career priority (salary, flexibility, social impact): ${data.q8}
9. Willingness to travel or relocate: ${data.q9}
10. Education level willing to pursue: ${data.q10}
11. Learning vs routine preference: ${data.q11}
12. Importance of work-life balance: ${data.q12}
13. Motivation (stability, growth, passion): ${data.q13}
14. 5-year professional vision: ${data.q14}
15. Preference (corporate, startup, self-employed): ${data.q15}
16. Comfort level with stress: ${data.q16}
17. Career curiosity not yet explored: ${data.q17}

Please return a clear, well-structured recommendation explaining the suggested career path and why it's a good fit.
  `;
}
