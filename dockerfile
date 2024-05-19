FROM ghcr.io/puppeteer/puppeteer:22.6.5
ENV PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
RUN apt-get update && apt-get install -y chromium-browser
COPY . .
CMD ["node","index.js"]