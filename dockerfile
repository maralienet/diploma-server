FROM ghcr.io/puppeteer/puppeteer:22.6.5
ENV PUPPETEER_CACHE_DIR=/opt/render/project/puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV CHROMIUM_PATH=/usr/bin/chromium-browser
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
RUN apt-get update && apt-get install -y chromium-browser
# Check if Chromium is installed
RUN which chromium-browser
# Check Chromium version
RUN chromium-browser --version
COPY . .
CMD ["node","index.js"]
