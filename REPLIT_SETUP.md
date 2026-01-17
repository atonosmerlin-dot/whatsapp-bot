# 🚀 WhatsApp Bot no Replit (GRATUITO)

## ✅ Configuração Rápida

### 1. No Replit, clique em "+ Create"
- Escolha "Import from GitHub"
- Cole: `https://github.com/atonosmerlin-dot/whatsapp-bot`

### 2. Aguarde carregar (2-3 minutos)
O Replit vai:
- ✅ Clonar seu repositório
- ✅ Instalar dependências (`npm install`)
- ✅ Baixar Chrome via Puppeteer
- ✅ Ficar online 24/7

### 3. Clicar em "Run"
- Vai abrir uma aba com a URL do seu bot
- URL será algo como: `https://whatsapp-bot.atonosmerlin.repl.co`

### 4. Escanear QR Code
Na aba do Replit, procure pela mensagem:
```
[BOT] 📱 Escaneie o QR Code para autenticar:
```

Escaneie com seu WhatsApp e pronto! ✅

---

## 🔗 URL Pública

Seu bot estará disponível em:
```
https://whatsapp-bot.atonosmerlin.repl.co
```

**Compartilhe essa URL com seu site!**

---

## 📱 Testar a API

Abra uma aba nova e teste:

```
https://whatsapp-bot.atonosmerlin.repl.co/status
```

Deve retornar:
```json
{
  "status": "online",
  "ready": true
}
```

---

## 🚨 Problemas Comuns

### "Build failed"
- Replit às vezes falha na primeira vez
- Clique em "Run" novamente
- Se persistir, vá em "Shell" e rode:
  ```bash
  npm install
  ```

### Bot fica offline
- Replit coloca apps dormindo se não receberem requisições
- Solução: Fazer um "ping" a cada 5 minutos

Adicione este código no seu site (JavaScript):
```javascript
setInterval(() => {
  fetch('https://seu-bot.repl.co/status').catch(() => {});
}, 5 * 60 * 1000); // a cada 5 minutos
```

### "Chrome não encontrado"
- Aguarde mais 2-3 minutos na primeira vez
- Chrome precisa de tempo para baixar (~300MB)
- Veja o console/logs para mais detalhes

---

## 🔑 Integrar com Seu Site

### JavaScript/Node.js

```javascript
const BOT_URL = 'https://seu-bot.repl.co';

async function sendOrder(orderData) {
  const response = await fetch(`${BOT_URL}/send-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId: 'PED-' + Date.now(),
      clientName: orderData.name,
      clientPhone: orderData.phone,
      pickupLocation: orderData.pickup,
      dropLocation: orderData.drop,
      amount: orderData.amount
    })
  });

  return await response.json();
}

// Usar no seu site
sendOrder({
  name: 'João Silva',
  phone: '5511999999999',
  pickup: 'Av. Paulista, 1000',
  drop: 'Rua Augusta, 500',
  amount: '45.50'
}).then(result => {
  console.log('Pedido enviado:', result);
});
```

### HTML Form Example

```html
<form id="orderForm">
  <input type="text" id="name" placeholder="Seu nome" required>
  <input type="text" id="phone" placeholder="11999999999" required>
  <input type="text" id="pickup" placeholder="Local saída" required>
  <input type="text" id="drop" placeholder="Destino" required>
  <input type="number" id="amount" placeholder="Valor" required>
  <button type="submit">Chamar Motorista</button>
</form>

<script>
  document.getElementById('orderForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const response = await fetch('https://seu-bot.repl.co/send-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: 'PED-' + Date.now(),
        clientName: document.getElementById('name').value,
        clientPhone: document.getElementById('phone').value,
        pickupLocation: document.getElementById('pickup').value,
        dropLocation: document.getElementById('drop').value,
        amount: document.getElementById('amount').value
      })
    });

    const data = await response.json();
    alert(data.success ? '✅ Pedido enviado para motoristas!' : '❌ Erro: ' + data.error);
  });
</script>
```

---

## 📊 Endpoints Disponíveis

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/status` | Status do bot |
| `GET` | `/drivers` | Listar motoristas |
| `POST` | `/drivers` | Adicionar motorista |
| `DELETE` | `/drivers/:phone` | Remover motorista |
| `POST` | `/send-message` | Enviar mensagem individual |
| `POST` | `/send-order` | Enviar pedido para todos |

---

## 🔐 Adicionar Segurança (Opcional)

Se quiser proteger sua API com uma chave:

**No index.js**, adicione após `const app = express();`:

```javascript
const API_KEY = process.env.API_KEY || 'minha-chave-secreta';

function checkAuth(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!key || key !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Proteja os endpoints importantes:
app.post('/send-order', checkAuth, async (req, res) => { ... });
```

**No Replit**, vá em "Secrets" (cadeado) e adicione:
```
API_KEY = sua-chave-super-secreta
```

**No seu site**, use:
```javascript
fetch('https://seu-bot.repl.co/send-order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'sua-chave-super-secreta'
  },
  body: JSON.stringify({ ... })
});
```

---

## 💡 Dicas Importantes

✅ **Replit é gratuito 100%** - sem trial, sem limite de tempo
✅ **URL pública** - funciona em qualquer lugar
✅ **Sempre online** - Replit mantém rodando
✅ **Fácil de debugar** - veja logs em tempo real
✅ **Compartilhe a URL** - qualquer pessoa acessa

---

## 🎯 Próximos Passos

1. ✅ Vá em https://replit.com
2. ✅ Clique "+ Create"
3. ✅ Import from GitHub: `atonosmerlin-dot/whatsapp-bot`
4. ✅ Clique "Run"
5. ✅ Aguarde 2-3 minutos
6. ✅ Escaneie o QR code
7. ✅ Use a URL no seu site!

**Avise quando ficar online!** 🚀
