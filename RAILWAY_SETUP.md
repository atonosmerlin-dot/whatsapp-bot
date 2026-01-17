# 🚂 Configuração do Bot no Railway.app

## ✅ Próximos Passos

### 1. Aguardar o Build Terminar
- Você deve ver "Building (00:09)" no dashboard
- Espere completar (cerca de 3-5 minutos)
- Quando terminar, vai aparecer uma URL como: `https://seu-projeto-production.railway.app`

### 2. Configurar Variáveis de Ambiente (se necessário)
No dashboard do Railway, vá até **Variables** e verifique:
- `NODE_ENV`: `production`
- `PORT`: `3000` (automático)

### 3. Primeiro Deploy - Escanear QR Code
Quando o bot ficar online pela primeira vez:

1. Vá até **Logs** no Railway
2. Procure pela mensagem: `📱 QR Code gerado - escaneie no WhatsApp Web:`
3. Escaneie o QR code com seu WhatsApp
4. Após autenticado, nunca mais vai pedir QR code

### 4. Testar a API
Depois que o bot online, teste os endpoints:

```bash
# Verificar se está online
curl https://seu-projeto-production.railway.app/status

# Adicionar motorista
curl -X POST https://seu-projeto-production.railway.app/drivers \
  -H "Content-Type: application/json" \
  -d '{"name":"João","phone":"5511999999999"}'

# Enviar pedido
curl -X POST https://seu-projeto-production.railway.app/send-order \
  -H "Content-Type: application/json" \
  -d '{
    "orderId":"PED-001",
    "clientName":"Cliente",
    "pickupLocation":"Av. Paulista, 1000",
    "dropLocation":"Rua Augusta, 500",
    "amount":"45.50"
  }'
```

---

## 🔧 Se der erro durante o build:

### Erro: "Chrome não encontrado"
- Railway usa Dockerfile agora, que já instala Chrome
- Deve funcionar automaticamente

### Erro: "Port já em uso"
- Railway configura a porta automaticamente
- Não altere o código

### Bot fica offline depois de alguns minutos
- Pode ser timeout de inatividade
- Você pode adicionar um "health check" que a API faça periodicamente

---

## 📊 Monitorar o Bot

No Railway dashboard você pode ver:
- **Logs**: Mensagens do bot em tempo real
- **Deployments**: Histórico de deploys
- **Metrics**: CPU, memória, etc.
- **Variables**: Variáveis de ambiente

---

## 🚀 Melhorias Futuras

Para adicionar autenticação (API Key):

**No index.js**, adicione após `const app = express();`

```javascript
const API_KEY = process.env.API_KEY || 'chave-padrao-mudar';

function verifyApiKey(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!key || key !== API_KEY) {
    return res.status(401).json({ error: 'API Key inválida' });
  }
  next();
}

// Proteja os endpoints críticos:
app.post('/send-order', verifyApiKey, async (req, res) => { ... });
app.post('/send-message', verifyApiKey, async (req, res) => { ... });
```

No Railway **Variables**, adicione:
- `API_KEY`: sua chave secreta

Depois use nos requests:
```bash
curl -X POST https://seu-bot.railway.app/send-order \
  -H "Content-Type: application/json" \
  -H "x-api-key: sua-chave-secreta" \
  -d '{ ... }'
```

---

## 💡 Dicas

✅ Railway é muito mais simples que Render
✅ Dockerfile vai funcionar melhor com Puppeteer  
✅ A URL é pública e estável
✅ Pode compartilhar direto com seu site

---

## 📞 Próximos Passos

1. Aguarde o build terminar
2. Vá em **Logs** e procure pelo QR code
3. Escaneie para autenticar
4. Depois teste a API com curl ou Postman

**Quer ajuda para integrar com seu site?** 🌐
