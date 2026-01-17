# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Instalar dependências do sistema para Chrome
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    gnupg \
    ca-certificates \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Copiar package files
COPY package*.json ./

# Instalar dependências Node
RUN npm ci --only=production

# Instalar Chrome via Puppeteer
RUN npx puppeteer browsers install chrome

# Production stage
FROM node:20-slim

WORKDIR /app

# Instalar dependências do Chrome
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libexpat1 \
    libgbm1 \
    libpango-1.0-0 \
    libpango-gobject-0 \
    libpangocairo-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    libasound2 \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Copiar do builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /root/.cache/puppeteer /root/.cache/puppeteer

# Copiar código da aplicação
COPY . .

# Expor porta
EXPOSE 3000

# Start
CMD ["npm", "start"]
