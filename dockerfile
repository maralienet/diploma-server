FROM ghcr.io/puppeteer/puppeteer:22.6.5
ENV PUPPETEER_CACHE_DIR=/usr/src/app/puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV CHROMIUM_PATH=/usr/bin/google-chrome-stable
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
# Проверка установлен ли Chromium
RUN which google-chrome-stable
# Проверка версии Chromium
RUN google-chrome-stable --version
COPY . .
CMD ["node","index.js"]
