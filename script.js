document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("input");
    const button = document.getElementById("button");
    const chatMessages = document.getElementById("chat-messages");


    // Helper function to send the prompt (used by both button and enter)
    async function sendPrompt() {

        const loadingBotMessage = document.createElement("div"); // Do not create this outside sendPrompt();
        const userMsg = document.createElement("div");  // Creating inside ensures new elements are created each time instead of reusing and resetting the same ones.

        chatMessages.scrollTop = chatMessages.scrollHeight;

        const prompt = input.value.trim();
        input.value = "";
        input.style.height = "24px";
        if (!prompt) return;

        userMsg.className = "user-chat-container";
        userMsg.innerHTML = `
            <div class="user-messages" id="user-messages">
                ${prompt}
            </div>
        `;

        loadingBotMessage.className = "message assistant-message";
        loadingBotMessage.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="loading">
                    <span>Generating response</span>
                </div>
            </div>
        `;
        
        chatMessages.append(userMsg);
        chatMessages.append(loadingBotMessage);
        // console.log(chatMessages.innerText);

        try {
            chatMessages.scrollTop = chatMessages.scrollHeight;
            const response = await fetch("http://localhost:3000/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: prompt })
            });

            const data = await response.json();

            let formatted = data.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
            formatted = formatted.replace(/`{1,2}([\s\S]*?)`{1,2}/g, "<i>$1</i>");

            loadingBotMessage.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>${formatted || "Error generating response."}</p>
                </div>
            `;
            // chatMessages.scrollTop = chatMessages.scrollHeight;

        } catch (error) {
            loadingBotMessage.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>Error: ${error.message}</p>
                </div>
            `;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // Button click listener
    button.addEventListener("click", async (e) => {
        e.preventDefault();
        await sendPrompt();
    });

    // Enter key listener on textarea
    input.addEventListener("keydown", async (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            await sendPrompt();
        }
    });

    input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 200) + 'px';
        input.style.overflowY = input.scrollHeight > 200 ? 'auto' : 'hidden';
    });
});
