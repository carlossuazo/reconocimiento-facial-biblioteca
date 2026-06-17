FROM node:24-alpine

WORKDIR /app

# Install dependencies first to leverage Docker layer caching
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source
COPY . .

# The app listens on the port provided via the PORT env var (defaults to 3000)
EXPOSE 3000

CMD ["node", "server.js"]
