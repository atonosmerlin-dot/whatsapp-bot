const { Client, LocalAuth } = require('whatsapp-web.js');
const puppeteer = require('puppeteer');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

let client = null;
let isClientReady = false;

// Função para encontrar o executável do Chrome
function findChromePath() {
  const possiblePaths = [
    '/opt/render/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome',
    path.join(process.env.HOME || '/root', '.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome'),
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/snap/bin/chromium',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  ];

  for (const chromePath of possiblePaths) {
    if (fs.existsSync(chromePath)) {
      console.log(`[BOT] ✓ Chrome encontrado em: ${chromePath}`);
      return chromePath;
    }
  }

  console.log('[BOT] ⚠️ Chrome não encontrado em caminhos conhecidos');
  return null;
}

// Função para carregar motoristas do arquivo
function loadDrivers() {
  const driversPath = path.join(__dirname, 'drivers.json');
  if (fs.existsSync(driversPath)) {
    const data = fs.readFileSync(driversPath, 'utf8');
    return JSON.parse(data);
  }
  return { drivers: [] };
}

// Inicializar WhatsApp Bot
async function initializeBot() {
  try {
    console.log('[BOT] 🚀 Iniciando WhatsApp Bot com Express API...');

    const chromePath = findChromePath();

    const launchArgs = {
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-web-resources'
      ]
    };

    if (chromePath) {
      launchArgs.executablePath = chromePath;
      console.log('[BOT] ℹ️ Usando Chrome encontrado');
    }

    const browser = await puppeteer.launch(launchArgs);

    console.log('[BOT] ✓ Puppeteer iniciado com sucesso!');

    // Inicializando cliente WhatsApp com LocalAuth persistente
    client = new Client({
      puppeteer: { browser },
      authStrategy: new LocalAuth({ clientId: 'whatsapp-bot-session' })
    });

    // Evento: QR Code para primeira autenticação
    client.on('qr', (qr) => {
      console.log('[BOT] 📱 QR Code gerado - escaneie no WhatsApp Web:');
      console.log(qr);
      console.log('[BOT] Acesse: http://localhost:3000/qr para ver o QR em tempo real');
    });

    // Evento: Autenticação bem-sucedida
    client.on('authenticated', () => {
      console.log('[BOT] ✓ Autenticado com sucesso!');
    });

    // Evento: Cliente pronto
    client.on('ready', () => {
      console.log('[BOT] ✓ WhatsApp conectado e pronto!');
      isClientReady = true;
    });

    // Evento: Mensagem recebida
    client.on('message', async (msg) => {
      try {
        console.log(`[BOT] 📨 Mensagem recebida de ${msg.from}: ${msg.body}`);

        // Resposta para ping
        if (msg.body.toLowerCase() === 'ping') {
          await msg.reply('Pong! 🏓');
          console.log(`[BOT] ✓ Resposta enviada para ${msg.from}`);
        }
      } catch (error) {
        console.error('[BOT] ❌ Erro ao processar mensagem:', error);
      }
    });

    // Evento: Desconexão
    client.on('disconnected', (reason) => {
      console.log(`[BOT] ⚠️ Desconectado: ${reason}`);
      isClientReady = false;
    });

    // Evento: Erro
    client.on('error', (error) => {
      console.error('[BOT] ❌ Erro no cliente:', error);
    });

    // Inicializar cliente
    await client.initialize();

  } catch (error) {
    console.error('[BOT] ❌ Erro fatal ao iniciar bot:', error);
    process.exit(1);
  }
}

// ======== ROTAS DA API ========

// Status do bot
app.get('/status', (req, res) => {
  res.json({
    status: isClientReady ? 'online' : 'offline',
    ready: isClientReady,
    timestamp: new Date().toISOString()
  });
});

// Endpoint para enviar mensagem para um motorista
app.post('/send-message', async (req, res) => {
  try {
    if (!isClientReady) {
      return res.status(503).json({ error: 'Bot não está pronto', success: false });
    }

    const { phone, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({ 
        error: 'Phone e message são obrigatórios', 
        success: false 
      });
    }

    // Formatar número do WhatsApp (adicionar @c.us se necessário)
    const chatId = phone.includes('@') ? phone : `${phone}@c.us`;

    console.log(`[API] 📤 Enviando mensagem para ${phone}`);
    console.log(`[API] 📝 Mensagem: ${message}`);

    await client.sendMessage(chatId, message);

    console.log(`[API] ✓ Mensagem enviada para ${phone}`);
    res.json({ 
      success: true, 
      message: 'Mensagem enviada com sucesso',
      phone: phone,
      sentAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('[API] ❌ Erro ao enviar mensagem:', error.message);
    res.status(500).json({ 
      error: error.message, 
      success: false 
    });
  }
});

// Endpoint para enviar pedido para TODOS os motoristas cadastrados
app.post('/send-order', async (req, res) => {
  try {
    if (!isClientReady) {
      return res.status(503).json({ error: 'Bot não está pronto', success: false });
    }

    const { orderId, clientName, clientPhone, pickupLocation, dropLocation, amount } = req.body;

    if (!orderId || !clientName || !pickupLocation || !dropLocation) {
      return res.status(400).json({ 
        error: 'orderId, clientName, pickupLocation e dropLocation são obrigatórios', 
        success: false 
      });
    }

    const driversData = loadDrivers();
    const drivers = driversData.drivers || [];

    if (drivers.length === 0) {
      return res.status(400).json({ 
        error: 'Nenhum motorista cadastrado', 
        success: false 
      });
    }

    // Formatar mensagem do pedido
    const orderMessage = `
🚗 *NOVO PEDIDO*

*Pedido #${orderId}*
👤 Cliente: ${clientName}
📱 Telefone: ${clientPhone || 'N/A'}
📍 Saída: ${pickupLocation}
🏁 Destino: ${dropLocation}
💰 Valor: R$ ${amount || 'A confirmar'}

Responda se aceita o pedido!
    `.trim();

    console.log(`[API] 📤 Enviando pedido #${orderId} para ${drivers.length} motoristas`);

    const sentTo = [];
    const errors = [];

    // Enviar para cada motorista
    for (const driver of drivers) {
      try {
        const chatId = driver.phone.includes('@') ? driver.phone : `${driver.phone}@c.us`;
        await client.sendMessage(chatId, orderMessage);
        sentTo.push(driver.name);
        console.log(`[API] ✓ Pedido enviado para ${driver.name}`);
      } catch (error) {
        errors.push({ driver: driver.name, error: error.message });
        console.error(`[API] ❌ Erro ao enviar para ${driver.name}:`, error.message);
      }
    }

    res.json({
      success: true,
      message: 'Pedido enviado',
      orderId: orderId,
      sentTo: sentTo,
      totalDrivers: drivers.length,
      errors: errors.length > 0 ? errors : null,
      sentAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('[API] ❌ Erro ao enviar pedido:', error.message);
    res.status(500).json({ 
      error: error.message, 
      success: false 
    });
  }
});

// Endpoint para listar motoristas cadastrados
app.get('/drivers', (req, res) => {
  try {
    const driversData = loadDrivers();
    res.json({
      drivers: driversData.drivers || [],
      total: (driversData.drivers || []).length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para adicionar motorista
app.post('/drivers', (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Nome e telefone são obrigatórios' });
    }

    const driversPath = path.join(__dirname, 'drivers.json');
    let driversData = { drivers: [] };

    if (fs.existsSync(driversPath)) {
      const data = fs.readFileSync(driversPath, 'utf8');
      driversData = JSON.parse(data);
    }

    // Verificar se motorista já existe
    const exists = driversData.drivers.some(d => d.phone === phone);
    if (exists) {
      return res.status(400).json({ error: 'Motorista já cadastrado' });
    }

    driversData.drivers.push({
      name,
      phone,
      addedAt: new Date().toISOString()
    });

    fs.writeFileSync(driversPath, JSON.stringify(driversData, null, 2));

    res.json({
      success: true,
      message: 'Motorista cadastrado com sucesso',
      driver: { name, phone }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para deletar motorista
app.delete('/drivers/:phone', (req, res) => {
  try {
    const { phone } = req.params;
    const driversPath = path.join(__dirname, 'drivers.json');

    if (!fs.existsSync(driversPath)) {
      return res.status(404).json({ error: 'Nenhum motorista cadastrado' });
    }

    const data = fs.readFileSync(driversPath, 'utf8');
    let driversData = JSON.parse(data);

    const initialCount = driversData.drivers.length;
    driversData.drivers = driversData.drivers.filter(d => d.phone !== phone);

    if (driversData.drivers.length === initialCount) {
      return res.status(404).json({ error: 'Motorista não encontrado' });
    }

    fs.writeFileSync(driversPath, JSON.stringify(driversData, null, 2));

    res.json({
      success: true,
      message: 'Motorista removido com sucesso'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({
    name: 'WhatsApp Bot API',
    version: '1.0.0',
    status: isClientReady ? 'online' : 'offline',
    endpoints: {
      'GET /status': 'Status do bot',
      'GET /drivers': 'Listar motoristas',
      'POST /drivers': 'Adicionar motorista',
      'DELETE /drivers/:phone': 'Remover motorista',
      'POST /send-message': 'Enviar mensagem individual',
      'POST /send-order': 'Enviar pedido para todos os motoristas'
    }
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

initializeBot().then(() => {
  app.listen(PORT, () => {
    console.log(`[SERVER] 🚀 API rodando na porta ${PORT}`);
    console.log(`[SERVER] 📊 Visite http://localhost:${PORT} para documentação`);
  });
}).catch(error => {
  console.error('[INIT] ❌ Erro fatal:', error);
  process.exit(1);
});

