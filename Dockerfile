FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy source files
COPY . .

# Build TypeScript
RUN npm run build

# Check what files exist after build
RUN echo "=== Files after build ===" && \
    ls -la && \
    echo "=== dist folder ===" && \
    ls -la dist/ 2>/dev/null || echo "No dist folder" && \
    echo "=== src folder ===" && \
    ls -la src/ 2>/dev/null || echo "No src folder"

# Expose port
EXPOSE 3000

# Start from dist/app.js (based on your package.json)
CMD ["node", "dist/app.js"]
