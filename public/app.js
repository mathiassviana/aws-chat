const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');
const statusElement = document.getElementById('status');

function displayMessage(sender, message) {
    const element = document.createElement('p');
    element.className = 'message';

    const label = document.createElement('strong');
    label.textContent = `${sender}: `;

    element.appendChild(label);
    element.appendChild(document.createTextNode(message));
    chatMessages.appendChild(element);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const message = input.value.trim();
    if (!message || sendButton.disabled) return;

    displayMessage('Você', message);
    input.value = '';
    sendButton.disabled = true;
    statusElement.textContent = 'Aguardando resposta do agente...';

    try {
        const response = await fetch('/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.error || `Erro HTTP ${response.status}`);
        }

        displayMessage('AgenteCore IA', data.reply || 'O modelo não retornou texto.');
        statusElement.textContent = '';
    } catch (error) {
        displayMessage('Sistema', error.message || 'Não foi possível conectar ao servidor.');
        statusElement.textContent = 'Verifique a conexão e os logs do servidor.';
    } finally {
        sendButton.disabled = false;
        input.focus();
    }
});
