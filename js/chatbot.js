// Chatbot functionality
document.addEventListener("DOMContentLoaded", () => {
  const chatMessages = document.querySelector(".chat-messages");
  const chatInput = document.querySelector(".chat-input");
  const chatSend = document.querySelector(".chat-send");
  const typingIndicator = document.querySelector(".typing-indicator");

  // Predefined API key
  const API_KEY = "YOUR API KEY HERE";

  // Initial bot message
  const initialMessage = `Hello! 👋 I'm your AI Career Assistant. I can help you with:
    • Career guidance and advice
    • Resume and cover letter tips
    • Interview preparation
    • Job search strategies
    • Professional development
    
    How can I assist you today?`;

  addBotMessage(initialMessage);

  // Function to add user message
  function addUserMessage(message) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message user-message";
    messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${message}</div>
            </div>
        `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Function to add bot message
  function addBotMessage(message) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message bot-message";
    messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${message}</div>
            </div>
        `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Function to show typing indicator
  function showTypingIndicator() {
    typingIndicator.style.display = "flex";
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Function to hide typing indicator
  function hideTypingIndicator() {
    typingIndicator.style.display = "none";
  }

  // Function to handle API call
  async function getBotResponse(userMessage) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `You are a helpful career advisor AI assistant. Provide professional and accurate career advice. Keep responses concise and practical. User question: ${userMessage}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
              topP: 0.8,
              topK: 40,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(
          `API Error: ${errorData.error?.message || "Unknown error occurred"}`
        );
      }

      const data = await response.json();
      console.log("API Response:", data); // Debug log

      if (
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts[0]
      ) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error("Invalid response format:", data);
        throw new Error("Invalid response format from Gemini API");
      }
    } catch (error) {
      console.error("Error:", error);
      return `Error: ${error.message}. Please try again later or contact support if the issue persists.`;
    }
  }

  // Event listener for send button
  chatSend.addEventListener("click", async () => {
    const message = chatInput.value.trim();
    if (message) {
      addUserMessage(message);
      chatInput.value = "";

      showTypingIndicator();
      const botResponse = await getBotResponse(message);
      hideTypingIndicator();

      addBotMessage(botResponse);
    }
  });

  // Event listener for Enter key
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      chatSend.click();
    }
  });
});
