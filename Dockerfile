# Stage 1: Builder - Install ALL dependencies and build TypeScript
FROM node:20-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies)
RUN npm ci

# Copy source files
COPY . .

# Build TypeScript to dist folder
RUN npm run build

# Stage 2: Production - Only production dependencies
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy EJS views from src/views (your actual location)
COPY --from=builder /usr/src/app/src/views ./views

# Copy static files from src/public (your actual location)  
COPY --from=builder /usr/src/app/src/public ./public

# Copy package.json for any runtime scripts if needed
COPY --from=builder /usr/src/app/package.json ./

# Expose port
EXPOSE 3000

# Start the app from dist folder
CMD ["node", "dist/app.js"]
