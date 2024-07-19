const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const messages = document.getElementById("chat-messages");
const apiKey = "AIzaSyC4RUIBeU3601PeAy2ulubE1q9hRwmUtlI"; // Google Gemini API Key

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = input.value;

    input.value = "";

    messages.innerHTML += `<div class="message user-message">
        <img src="./icons/user.png" alt="user icon"> <span>${message}</span>
    </div>`;

        try {

            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                {
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: message }]
                        }
                    ]
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            const chatbotResponse = await response.data.candidates[0].content.parts[0].text;
            const formattedResponse = formatResponse(chatbotResponse);
            messages.innerHTML += `<div class="message bot-message">
                <span>${formattedResponse}</span>
            </div>`;
        } catch (error) {
            console.error('Error:', error);
            messages.innerHTML += `<div class="message bot-message">
                <img src="./icons/chatbot.png" alt="bot icon"> <span>Sorry, there was an error.</span>
            </div>`;
        }
    messages.scrollTop = messages.scrollHeight;
});
function formatResponse(response) {
    let formattedResponse = "";
    const lines = response.split('\n');
    let inList = false;

    lines.forEach(line => {
        if (line.startsWith('**') && line.endsWith('**')) {

            if (inList) {
                formattedResponse += '</ul>';
                inList = false;
            }
            formattedResponse += `<h2>${line.replace(/\*\*/g, '')}</h2>`;
        } else if (line.startsWith('* ')) {
  
            if (!inList) {
                formattedResponse += '<ul>';
                inList = true;
            }
            formattedResponse += `<li>${line.replace('* ', '')}</li>`;
        } else if (line.startsWith('**') && line.includes(':**')) {

            if (inList) {
                formattedResponse += '</ul>';
                inList = false;
            }
            const parts = line.split(':**');
            formattedResponse += `<strong>${parts[0].replace(/\*\*/g, '')}:</strong> ${parts[1]}`;
        } else {
            // Paragraph
            if (inList) {
                formattedResponse += '</ul>';
                inList = false;
            }
            formattedResponse += `<p>${line}</p>`;
        }
    });

    if (inList) {
        formattedResponse += '</ul>';
    }

    return formattedResponse;
}








