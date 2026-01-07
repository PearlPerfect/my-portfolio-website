FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy all source files
COPY . .

# Build TypeScript
RUN npm run build

# Check if dist folder was created
RUN ls -la && echo "=== Checking dist ===" && ls -la dist/ 2>/dev/null || echo "dist not found, checking src..." && ls -la src/

# Expose port
EXPOSE 3000

# Start the app - try different entry points
CMD if [ -f "dist/app.js" ]; then node dist/app.js; elif [ -f "server.js" ]; then node server.js; else node src/app.js; fi
