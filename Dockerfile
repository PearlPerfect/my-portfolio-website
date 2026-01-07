# Stage 1: Builder - Install ALL dependencies and build TypeScript
FROM node:18-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev)
RUN npm ci

# Copy source files
COPY . .

# Build TypeScript to dist folder
RUN npm run build

# Stage 2: Production - Only production dependencies
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /usr/src/app/dist ./dist
# Copy EJS views and other static files
COPY --from=builder /usr/src/app/views ./views
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/src ./src

# Expose port
EXPOSE 3000

# Start the app from dist folder
CMD ["node", "dist/app.js"]
