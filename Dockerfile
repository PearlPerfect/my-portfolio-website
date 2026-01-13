FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm install --save-dev typescript @types/node

# Copy source files
COPY . .

# Build TypeScript
RUN npm run build

# IMPORTANT: Copy views and public folders to dist
RUN mkdir -p dist/views dist/public && \
    cp -r src/views/* dist/views/ && \
    cp -r src/public/* dist/public/

# Verify everything is in place
RUN echo "=== Checking dist structure ===" && \
    ls -la dist/ && \
    echo "=== Views folder ===" && \
    ls -la dist/views/ && \
    echo "=== Public folder ===" && \
    ls -la dist/public/

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/app.js"]