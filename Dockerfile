FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm install --save-dev typescript @types/node

# Copy source files
COPY . .

# Build TypeScript with verbose output
RUN echo "=== Starting TypeScript build ===" && \
    npx tsc --listFiles && \
    echo "=== Build complete, checking output ===" && \
    ls -la && \
    echo "=== dist folder contents ===" && \
    ls -la dist/ || (echo "ERROR: No dist folder created!" && exit 1)

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/app.js"]