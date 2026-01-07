# Use official Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for build)
RUN npm ci

# Copy app source
COPY . .

# Build TypeScript (if you have TypeScript files)
RUN npm run build

# Install ONLY production dependencies for runtime
RUN npm ci --only=production

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
