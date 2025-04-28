// Chatbot functionality
document.addEventListener("DOMContentLoaded", () => {
  const chatMessages = document.querySelector(".chat-messages");
  const chatInput = document.querySelector(".chat-input");
  const chatSend = document.querySelector(".chat-send");
  const typingIndicator = document.querySelector(".typing-indicator");

  // WARNING: Exposing API keys in frontend code is insecure.
  const API_KEY = "AIzaSyBaZ5P70MsLntvVhXLyXrXLE-_huEOFdp0";
  const API_url=`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  // const initialMessage = `Hello! 👋 I'm your AI Career Assistant. I can help you with:
  //   • Career guidance and advice
  //   • Resume and cover letter tips
  //   • Interview preparation
  //   • Job search strategies
  //   • Professional development
    
  //   How can I assist you today?`;

  // addBotMessage(initialMessage);

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
  let typingIndicatorElement = null; 

  function showTypingIndicator() {
    typingIndicatorElement = document.createElement("div");
    typingIndicatorElement.className = "typing-indicator";
    typingIndicatorElement.innerHTML = `
      <div class="typing-avatar">
        <img src="../assets/images/google-gemini-icon.png" alt="Loading..." />
      </div>
    `;
    const chatMessages = document.querySelector(".chat-messages");
    chatMessages.appendChild(typingIndicatorElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  
  function hideTypingIndicator() {
    if (typingIndicatorElement) {
      typingIndicatorElement.remove();
      typingIndicatorElement = null;
    }
  }
  

  async function getBotResponse(userMessage) {
    try {
      const response = await fetch(
        API_url,
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
      console.log("API Response:", data);
      const rawReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn’t get that.";

      // Clean the reply: remove * and - symbols
      const cleanedReply = rawReply.replace(/[*-]\s?/g, '').trim();
      
      // Shorten reply if very long
      const finalReply = cleanedReply.length > 300 ? cleanedReply.slice(0, 300) + "..." : cleanedReply;
      
      return finalReply;
      
      return reply;
    } catch (error) {
      console.error("Error:", error);
      return `Error: ${error.message}. Please try again later or contact support if the issue persists.`;
    }
  }

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

  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      chatSend.click();
    }
  });
});
