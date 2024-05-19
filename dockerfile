FROM puppeteer/puppeteer:latest
WORKDIR /opt/render/.cache/
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node","index.js"]