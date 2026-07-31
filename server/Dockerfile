# Base image
FROM node:18-bullseye

# Install dependencies needed by Playwright and Chromium
RUN apt-get update && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install dependencies (including Playwright)
RUN npm install

# Install Playwright browsers (Chromium only)
RUN npx playwright install chromium

# Copy the rest of your app
COPY . .

# Build the app (for Next.js or TS)
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
