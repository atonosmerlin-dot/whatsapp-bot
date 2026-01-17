# WhatsApp Bot API para Sistema de Pedidos

Bot WhatsApp com API para enviar pedidos de corrida/entrega para motoristas cadastrados.

## 🚀 Deploy no Render

1. Conectar repositório GitHub no Render
2. Node version: `20.x`
3. Build command: `npm install`
4. Start command: `npm start`
5. Adicionar **Disk Volume**:
   - Name: `chrome-cache`
   - Mount path: `/root/.cache/puppeteer`
   - Size: 2GB
6. Deploy e escanear QR code na primeira execução

## 📱 Endpoints da API

### 1. Status do Bot
```bash
GET /status
```

Retorna:
```json
{
  "status": "online",
  "ready": true,
  "timestamp": "2026-01-17T15:00:00.000Z"
}
```

---

### 2. Enviar Mensagem Individual
```bash
POST /send-message
Content-Type: application/json

{
  "phone": "5511999999999",
  "message": "Olá! Você tem um novo pedido!"
}
```

Retorna:
```json
{
  "success": true,
  "message": "Mensagem enviada com sucesso",
  "phone": "5511999999999",
  "sentAt": "2026-01-17T15:00:00.000Z"
}
```

---

### 3. Enviar Pedido para TODOS os Motoristas
```bash
POST /send-order
Content-Type: application/json

{
  "orderId": "PED-001",
  "clientName": "João Cliente",
  "clientPhone": "5511988888888",
  "pickupLocation": "Av. Paulista, 1000 - São Paulo",
  "dropLocation": "Rua Augusta, 500 - São Paulo",
  "amount": "45.50"
}
```

Retorna:
```json
{
  "success": true,
  "message": "Pedido enviado",
  "orderId": "PED-001",
  "sentTo": ["João Silva", "Maria Santos"],
  "totalDrivers": 2,
  "errors": null,
  "sentAt": "2026-01-17T15:00:00.000Z"
}
```

---

### 4. Listar Motoristas Cadastrados
```bash
GET /drivers
```

Retorna:
```json
{
  "drivers": [
    {
      "name": "João Silva",
      "phone": "5511999999999",
      "addedAt": "2026-01-17T00:00:00.000Z"
    },
    {
      "name": "Maria Santos",
      "phone": "5511988888888",
      "addedAt": "2026-01-17T00:00:00.000Z"
    }
  ],
  "total": 2
}
```

---

### 5. Adicionar Motorista
```bash
POST /drivers
Content-Type: application/json

{
  "name": "Pedro Oliveira",
  "phone": "5511977777777"
}
```

Retorna:
```json
{
  "success": true,
  "message": "Motorista cadastrado com sucesso",
  "driver": {
    "name": "Pedro Oliveira",
    "phone": "5511977777777"
  }
}
```

---

### 6. Remover Motorista
```bash
DELETE /drivers/5511977777777
```

Retorna:
```json
{
  "success": true,
  "message": "Motorista removido com sucesso"
}
```

---

## 💻 Exemplo de Integração (JavaScript/Node.js)

```javascript
// Enviar pedido para todos os motoristas
async function sendOrderToDrivers() {
  const response = await fetch('https://seu-bot.render.com/send-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId: 'PED-' + Date.now(),
      clientName: 'João Cliente',
      clientPhone: '5511988888888',
      pickupLocation: 'Av. Paulista, 1000',
      dropLocation: 'Rua Augusta, 500',
      amount: '45.50'
    })
  });

  const data = await response.json();
  console.log('Pedido enviado para', data.sentTo);
}

// Adicionar novo motorista
async function addDriver() {
  const response = await fetch('https://seu-bot.render.com/drivers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Carlos',
      phone: '5511966666666'
    })
  });

  const data = await response.json();
  console.log('Motorista adicionado:', data.driver.name);
}
```

---

## 💻 Exemplo de Integração (HTML/Fetch)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Enviar Pedido</title>
</head>
<body>
  <h1>Enviar Pedido WhatsApp</h1>
  
  <form id="pedidoForm">
    <input type="text" id="clientName" placeholder="Nome do cliente" required>
    <input type="text" id="pickupLocation" placeholder="Local de saída" required>
    <input type="text" id="dropLocation" placeholder="Destino" required>
    <input type="number" id="amount" placeholder="Valor" required>
    <button type="submit">Enviar Pedido</button>
  </form>

  <script>
    document.getElementById('pedidoForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const response = await fetch('https://seu-bot.render.com/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: 'PED-' + Date.now(),
          clientName: document.getElementById('clientName').value,
          pickupLocation: document.getElementById('pickupLocation').value,
          dropLocation: document.getElementById('dropLocation').value,
          amount: document.getElementById('amount').value
        })
      });

      const result = await response.json();
      alert(result.success ? 'Pedido enviado!' : 'Erro: ' + result.error);
    });
  </script>
</body>
</html>
```

---

## 🔐 Segurança

Para adicionar autenticação básica, crie uma variável de ambiente no Render:

```javascript
// No index.js, adicione um middleware:
const API_KEY = process.env.API_KEY || 'chave-padrao';

function verifyApiKey(req, res, next) {
  const key = req.headers['x-api-key'];
  if (key !== API_KEY) {
    return res.status(401).json({ error: 'API Key inválida' });
  }
  next();
}

// Use antes dos endpoints:
app.post('/send-order', verifyApiKey, async (req, res) => { ... });
```

Nos requests, adicione:
```javascript
headers: {
  'Content-Type': 'application/json',
  'x-api-key': 'sua-chave-secreta'
}
```

---

## 📁 Estrutura do Projeto

```
whatsapp-bot/
├── index.js                 # Bot + API Express
├── package.json            # Dependências
├── drivers.json            # Motoristas cadastrados
├── scripts/
│   └── install-chrome.js   # Script de instalação
├── .puppeteerrc.cjs        # Config do Puppeteer
└── render.yaml             # Config do Render
```

---

## 🚨 Troubleshooting

**Bot offline?**
- Visite a URL do Render e escaneie o QR code que aparece no console

**Erro ao enviar mensagem?**
- Verifique se o número tem WhatsApp
- Número deve estar com código do país: `55` + DDD + número

**Chrome não encontrado?**
- Certifique que o Disk Volume está configurado no Render
- Aguarde a instalação completar (pode levar alguns minutos)

---

## 📞 Suporte

Para dúvidas sobre whatsapp-web.js: https://github.com/pedrosog/whatsapp-web.js
