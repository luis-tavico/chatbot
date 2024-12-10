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
    "nombre?": 7
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

// Convertir texto a tensor (similar a `text_to_tensor` en PyTorch)
function textToTensor(text) {
    const tokens = tokenize(text);
    const indices = tokens.map(token => vocab[token] || 0); // Usar 0 para palabras desconocidas
    const tensor = new Float32Array(indices.length);
    for (let i = 0; i < indices.length; i++) {
        tensor[i] = indices[i];
    }
    return tensor;
}

// Enviar mensaje y obtener la respuesta del modelo
async function sendMessage() {
    const inputElement = document.getElementById('user-input');
    const userMessage = inputElement.value.trim();
    if (!userMessage) return;

    addMessageToChatLog("Tu", userMessage, "sent");
    inputElement.value = ''; // Limpiar campo de entrada

    const inputTensor = textToTensor(userMessage);
    const tensorData = new ort.Tensor('float32', inputTensor, [1, inputTensor.length]);

    try {
        const result = await session.run({ input: tensorData });
        const output = result.output.data;

        const responseIndex = output.indexOf(Math.max(...output));
        const responses = [
            "¡Hola! ¿Como estas?",
            "Estoy bien, gracias por preguntar.",
            "¡Adios! Cuídate.",
            "Soy un chatbot simple."
        ];

        const botResponse = responses[responseIndex] || "No entiendo tu mensaje.";
        setTimeout(() => {
            addMessageToChatLog("Chatbot", botResponse, "received");
        }, 500); // Simula un retraso en la respuesta
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