const express = require('express');
const {
    BedrockRuntimeClient,
    ConverseCommand
} = require('@aws-sdk/client-bedrock-runtime');

const app = express();
const port = Number(process.env.PORT || 3000);
const region = process.env.AWS_REGION || 'us-east-1';
const modelId = process.env.BEDROCK_MODEL_ID || 'amazon.nova-lite-v1:0';

const bedrock = new BedrockRuntimeClient({ region });

app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));
app.use(express.static('public'));

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.post('/sendMessage', async (req, res) => {
    const message = req.body?.message;

    if (typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'Digite uma mensagem válida.' });
    }

    if (message.length > 4000) {
        return res.status(400).json({ error: 'A mensagem deve ter no máximo 4000 caracteres.' });
    }

    try {
        const command = new ConverseCommand({
            modelId,
            messages: [{
                role: 'user',
                content: [{ text: message.trim() }]
            }],
            inferenceConfig: {
                maxTokens: 500,
                temperature: 0.5
            }
        });

        const response = await bedrock.send(command);
        const reply = (response.output?.message?.content || [])
            .filter((item) => typeof item.text === 'string')
            .map((item) => item.text)
            .join('\n')
            .trim();

        if (!reply) {
            console.error('O Amazon Bedrock retornou uma resposta sem texto.');
            return res.status(502).json({ error: 'O modelo não retornou uma resposta textual.' });
        }

        return res.json({ reply });
    } catch (error) {
        // Registre detalhes no log do servidor, mas não os exponha ao navegador.
        console.error('Falha ao chamar o Amazon Bedrock:', {
            name: error.name,
            message: error.message,
            region,
            modelId
        });

        return res.status(502).json({
            error: 'Não foi possível obter uma resposta da IA. Verifique a configuração do Bedrock e os logs do servidor.'
        });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`AgenteCore iniciado na porta ${port}`);
    console.log(`Região AWS: ${region}`);
    console.log(`Modelo Bedrock: ${modelId}`);
});
