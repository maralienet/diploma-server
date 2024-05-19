FROM puppeteer/puppeteer:latest
WORKDIR /usr/src/app
COPY package*.json ./
RUN apt-get update && apt-get install -y chromium-browser
RUN npm ci
COPY . .
CMD ["node","index.js"]