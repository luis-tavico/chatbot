document.addEventListener("DOMContentLoaded", () => {
    const sendButton = document.getElementById("send-button");
    const userInput = document.getElementById("user-input");
    const messagesArea = document.getElementById("messages-area");

    const botResponses = {
        "hola": "¡Hola! ¿En que puedo ayudarte?",
        "ayuda": "Claro, dime que necesitas.",
        "gracias": "¡De nada! Siempre estoy aqui para ayudarte.",
        "adios": "Adios, ¡que tengas un buen dia!",
        "default": "No estoy seguro de como responder a eso, pero sigo aprendiendo."
    };

    const addMessage = (message, type) => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", type);

        const contentDiv = document.createElement("div");
        contentDiv.classList.add("message-content");

        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        contentDiv.innerHTML = `<p>${message}</p><span class="time">${currentTime}</span>`;

        if (type === "received") {
            const img = document.createElement("img");
            img.src = "images/bot.png";
            img.alt = "Bot Image";
            img.classList.add("message-image");
            messageDiv.appendChild(img);
        }

        messageDiv.appendChild(contentDiv);
        messagesArea.appendChild(messageDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    };

    const handleSend = () => {
        const userMessage = userInput.value.trim();
        if (userMessage) {
            addMessage(userMessage, "sent");
            userInput.value = "";

            // Generar respuesta del bot
            const botMessage = botResponses[userMessage.toLowerCase()] || botResponses["default"];
            setTimeout(() => {
                addMessage(botMessage, "received");
            }, 500); // Simula un retraso de respuesta
        }
    };

    sendButton.addEventListener("click", handleSend);

    userInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    });
});