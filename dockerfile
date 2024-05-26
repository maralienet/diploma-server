FROM ghcr.io/puppeteer/puppeteer:22.6.5
ENV PUPPETEER_CACHE_DIR=/usr/src/app/puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV CHROMIUM_PATH=/usr/bin/google-chrome-stable
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
# Check if Chromium is installed
RUN which google-chrome-stable
# Check Chromium version
RUN google-chrome-stable --version
COPY . .
CMD ["node","index.js"]
