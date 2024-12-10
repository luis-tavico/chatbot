
// Ruta del modelo ONNX
const MODEL_URL = 'chatbot_model.onnx';

// Diccionario de palabras usado en el modelo
const vocab = {
    "hola": 0,
    "¿como": 1,
    "estas?": 2,
    "adios": 3,
    "¿cual": 4,
    "es": 5,
    "tu": 6,
    "nombre?": 7,
    "¿que": 8,
    "haces?": 9,
    "python?": 10,
    "cuentame": 11,
    "un": 12,
    "chiste": 13,
    "dia": 14,
    "hoy?": 15,
    "gracias": 16,
    "¿puedes": 17,
    "ayudarme?": 18,
};

// Cargar el modelo ONNX
let session;

async function loadModel() {
    console.log("Cargando modelo...");
    session = await ort.InferenceSession.create(MODEL_URL);
    console.log("Modelo cargado exitosamente.");
}

// Tokenizar entrada del usuario
function tokenize(text) {
    return text.toLowerCase().split(" ");
}

// Convertir texto a tensor
function textToTensor(text) {
    const tokens = tokenize(text);
    const indices = tokens.map(token => vocab[token] || 0);
    const tensor = new Float32Array(indices.length);
    for (let i = 0; i < indices.length; i++) {
        tensor[i] = indices[i];
    }
    return tensor;
}

// Enviar mensaje y obtener la respuesta
async function sendMessage() {
    const inputElement = document.getElementById('user-input');
    const userMessage = inputElement.value.trim();
    if (!userMessage) return;

    addMessageToChatLog("Tu", userMessage, "sent");
    inputElement.value = '';

    const inputTensor = textToTensor(userMessage);
    const tensorData = new ort.Tensor('float32', inputTensor, [1, inputTensor.length]);

    try {
        const result = await session.run({ input: tensorData });
        const output = result.output.data;

        const responseIndex = output.indexOf(Math.max(...output));
        const responses = [
            "¡Hola! ¿Como estas?",
            "Estoy bien, gracias por preguntar.",
            "¡Adios! Cuidate.",
            "Soy un chatbot simple.",
            "Estoy aqui para ayudarte.",
            "Python es un lenguaje de programacion popular.",
            "¿Por que el libro de matematicas estaba triste? Porque tenia muchos problemas.",
            "No tengo un calendario, pero puedo ayudarte con otras cosas.",
            "De nada, estoy para servirte.",
            "¡Claro! Dime en que necesitas ayuda."
        ]

        const botResponse = responses[responseIndex] || "No entiendo tu mensaje.";
        setTimeout(() => {
            addMessageToChatLog("Chatbot", botResponse, "received");
        }, 500);
    } catch (error) {
        console.error("Error durante la inferencia:", error);
    }
}

// Mostrar mensajes en la interfaz
function addMessageToChatLog(sender, message, type) {
    const chatLog = document.getElementById('chat-log');
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", type);

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("message-content");

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    contentDiv.innerHTML = `<p><strong>${sender}:</strong> ${message}</p><span class="time">${currentTime}</span>`;

    if (type === "received") {
        const img = document.createElement("img");
        img.src = "images/bot.png";
        img.alt = "Bot Image";
        img.classList.add("message-image");
        messageDiv.appendChild(img);
    }

    messageDiv.appendChild(contentDiv);
    chatLog.appendChild(messageDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
}

// Cargar el modelo al iniciar la página
window.onload = loadModel;