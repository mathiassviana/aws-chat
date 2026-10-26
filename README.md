# AgenteCore AWS — Chat com Amazon Bedrock

Aplicação web simples com frontend estático em `public/`, servidor Express e integração com a API `Converse` do Amazon Bedrock.

## Estrutura

```text
aws-chat/
├── public/
│   ├── index.html
│   └── app.js
├── server.js
├── package.json
├── .gitignore
└── README.md
```

## Requisitos

- Node.js 20 ou superior
- Uma conta AWS
- Um modelo compatível com a API Converse disponível na região selecionada
- Permissão IAM para `bedrock:InvokeModel`

## Instalação

Na pasta `aws-chat`:

```bash
npm install
```

Configure a região e o ID do modelo. Exemplo para Linux/macOS:

```bash
export AWS_REGION="us-east-1"
export BEDROCK_MODEL_ID="amazon.nova-lite-v1:0"
npm start
```

No PowerShell:

```powershell
$env:AWS_REGION = "us-east-1"
$env:BEDROCK_MODEL_ID = "amazon.nova-lite-v1:0"
npm start
```

Os valores acima são exemplos. Confirme no console do Amazon Bedrock se o modelo está disponível e habilitado para sua conta e região.

## Credenciais AWS

Em uma instância EC2, prefira associar uma IAM Role à instância com permissões mínimas para invocar apenas o modelo necessário. Não coloque chaves AWS no frontend, no repositório ou no arquivo `public/app.js`.

Para desenvolvimento local, utilize um perfil AWS configurado com a AWS CLI, se apropriado.

## Teste

Abra `http://localhost:3000` no navegador. Verifique a saúde do servidor em:

```text
http://localhost:3000/health
```

A conversa ainda não mantém histórico: cada solicitação envia apenas a mensagem atual ao modelo.

## Observações para implantação

- Para produção, disponibilize o site por HTTPS.
- Restrinja o acesso à instância e configure corretamente o firewall/grupos de segurança.
- Configure o envio de logs para o CloudWatch; `console.log` e `console.error` só serão enviados para lá se o ambiente de execução estiver configurado para coletá-los.
- Configure limites de uso, autenticação e monitoramento antes de disponibilizar publicamente.
