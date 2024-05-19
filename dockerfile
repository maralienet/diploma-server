FROM ghcr.io/puppeteer/puppeteer:22.6.5
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY packaje*.json ./
RUN npm ci
COPY . .
CMD ["node","index.js"]